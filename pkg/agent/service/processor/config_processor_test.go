package processor

import (
	"context"
	"strings"
	"testing"

	"evo-ai-core-service/internal/utils/stringutils"
	"evo-ai-core-service/pkg/agent/model"
	mcpmodel "evo-ai-core-service/pkg/mcp_server/model"

	"github.com/google/uuid"
)

// An official MCP server takes a secret env var from the vault, referenced by
// name in `credential_refs`.
//// `processMCPServers` rebuilds each entry from an ALLOWLIST of keys, so a field
// missing from it is dropped in silence and the runtime downstream finds no
// reference to resolve.

const serverID = "11111111-1111-1111-1111-111111111111"

func processorWithCatalog(t *testing.T, requiredEnvs string) ConfigProcessor {
	t.Helper()
	return NewConfigProcessor(
		func() string { return "generated-key" },
		func(_ context.Context, _ uuid.UUID) (*mcpmodel.McpServer, error) {
			return &mcpmodel.McpServer{
				Name:         "GitHub",
				Environments: requiredEnvs,
			}, nil
		},
	)
}

func TestCredentialRefsSurviveProcessing(t *testing.T) {
	processor := processorWithCatalog(t, `{"GITHUB_PERSONAL_ACCESS_TOKEN":"env@@GITHUB_PERSONAL_ACCESS_TOKEN"}`)

	processed, err := processor.processMCPServers(context.Background(), []interface{}{
		map[string]interface{}{
			"id":              serverID,
			"environments":    map[string]interface{}{"GITHUB_PERSONAL_ACCESS_TOKEN": "ghp-inline"},
			"credential_refs": map[string]interface{}{"GITHUB_PERSONAL_ACCESS_TOKEN": "cred-uuid"},
			"tools":           []interface{}{"search"},
		},
	})
	if err != nil {
		t.Fatalf("processing failed: %v", err)
	}

	refs, ok := processed[0]["credential_refs"].(map[string]interface{})
	if !ok {
		t.Fatal("credential_refs was dropped: the runtime would never see a reference to resolve")
	}
	if refs["GITHUB_PERSONAL_ACCESS_TOKEN"] != "cred-uuid" {
		t.Errorf("credential_refs = %v, want the reference the request carried", refs)
	}
	// The inline value stays as the fallback until story 2.7 retires it.
	envs := processed[0]["environments"].(map[string]interface{})
	if envs["GITHUB_PERSONAL_ACCESS_TOKEN"] != "ghp-inline" {
		t.Errorf("inline env was lost: %v", envs)
	}
}

// A required key satisfied ONLY by a vault reference must pass validation:
// demanding a plaintext value would make the vault unusable for exactly the
// secrets it exists to hold.
func TestRequiredEnvSatisfiedByVaultReference(t *testing.T) {
	processor := processorWithCatalog(t, `{"GITHUB_PERSONAL_ACCESS_TOKEN":"env@@GITHUB_PERSONAL_ACCESS_TOKEN"}`)

	processed, err := processor.processMCPServers(context.Background(), []interface{}{
		map[string]interface{}{
			"id":              serverID,
			"environments":    map[string]interface{}{},
			"credential_refs": map[string]interface{}{"GITHUB_PERSONAL_ACCESS_TOKEN": "cred-uuid"},
			"tools":           []interface{}{},
		},
	})
	if err != nil {
		t.Fatalf("a vault-referenced env var was rejected as missing: %v", err)
	}
	if processed[0]["credential_refs"] == nil {
		t.Error("the reference did not survive the very call that accepted it")
	}
}

// The validation still bites when a required key has neither a value nor a
// reference: the vault must not become a way around it.
func TestRequiredEnvStillRejectedWhenNeitherProvided(t *testing.T) {
	processor := processorWithCatalog(t, `{"GITHUB_PERSONAL_ACCESS_TOKEN":"env@@GITHUB_PERSONAL_ACCESS_TOKEN"}`)

	_, err := processor.processMCPServers(context.Background(), []interface{}{
		map[string]interface{}{
			"id":              serverID,
			"environments":    map[string]interface{}{},
			"credential_refs": map[string]interface{}{"OUTRA_VAR": "cred-uuid"},
			"tools":           []interface{}{},
		},
	})
	if err == nil {
		t.Fatal("a missing required env var was accepted")
	}
	if !strings.Contains(err.Error(), "GITHUB_PERSONAL_ACCESS_TOKEN") {
		t.Errorf("error does not name the missing variable: %v", err)
	}
}

// A server with no vault reference carries no empty map: absence stays absence,
// so nothing downstream has to tell "{}" apart from "not configured".
func TestNoCredentialRefsKeyWhenNoneGiven(t *testing.T) {
	processor := processorWithCatalog(t, `{}`)

	processed, err := processor.processMCPServers(context.Background(), []interface{}{
		map[string]interface{}{
			"id":           serverID,
			"environments": map[string]interface{}{},
			"tools":        []interface{}{},
		},
	})
	if err != nil {
		t.Fatalf("processing failed: %v", err)
	}
	if _, present := processed[0]["credential_refs"]; present {
		t.Error("an empty credential_refs was invented where the request had none")
	}
}

func TestConversationSkillConfigurationIsPreserved(t *testing.T) {
	agent := &model.Agent{
		Type: model.AgentTypeLLM,
		Config: `{
			"human_service_skill_enabled": true,
			"elite_sales_skill_enabled": true,
			"reception_triage_skill_enabled": true,
			"intent_router_skill_enabled": true,
			"concern_intelligence_skill_enabled": true,
			"service_recovery_skill_enabled": true,
			"cancellation_retention_skill_enabled": true,
			"customer_success_growth_skill_enabled": true,
			"customer_journey_skill_enabled": true,
			"scope_guard_skill_enabled": true,
			"lead_pipeline_management_skill_enabled": true,
			"conversation_skills": ["artgenial.human-service.v1", "artgenial.elite-sales.v1"]
		}`,
	}

	if err := processorWithDeadCatalog().ProcessAgentConfig(context.Background(), agent, nil); err != nil {
		t.Fatalf("create rejected: %v", err)
	}

	processed := stringutils.JSONToInterfaceMap(agent.Config)
	if processed["human_service_skill_enabled"] != true {
		t.Fatalf("human service toggle was not preserved: %v", processed)
	}
	if processed["elite_sales_skill_enabled"] != true {
		t.Fatalf("elite sales toggle was not preserved: %v", processed)
	}
	for _, toggle := range []string{
		"reception_triage_skill_enabled",
		"intent_router_skill_enabled",
		"concern_intelligence_skill_enabled",
		"service_recovery_skill_enabled",
		"cancellation_retention_skill_enabled",
		"customer_success_growth_skill_enabled",
		"customer_journey_skill_enabled",
		"scope_guard_skill_enabled",
		"lead_pipeline_management_skill_enabled",
	} {
		if processed[toggle] != true {
			t.Fatalf("%s was not preserved: %v", toggle, processed)
		}
	}
	skills, ok := processed["conversation_skills"].([]interface{})
	if !ok || len(skills) != 2 || skills[0] != "artgenial.human-service.v1" || skills[1] != "artgenial.elite-sales.v1" {
		t.Fatalf("versioned conversation skills were not preserved: %v", processed["conversation_skills"])
	}
}
