import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const triggerWorkflow = async (triggerSource: string, priority: string, details: any) => {
  console.log(`[WorkflowEngine] Trigger received from ${triggerSource}. Priority: ${priority}`);

  if (priority !== 'High' && priority !== 'Critical') {
    console.log('[WorkflowEngine] Priority is not critical enough for automated SOP execution. Logging only.');
    return null;
  }

  // Define hardcoded SOP for MVP
  const steps = [
    { action: "Evaluate Incident Severity via Gemini", status: "COMPLETED", timestamp: new Date() },
    { action: "Notify Relevant Department (Simulated SMS/Email)", status: "COMPLETED", timestamp: new Date() },
    { action: "Deploy Emergency Resources / Adjust Budget", status: "PENDING", timestamp: null }
  ];

  try {
    const workflow = await prisma.workflowExecution.create({
      data: {
        triggerSource,
        workflowType: details.category === 'Infrastructure' ? 'SOP_INFRASTRUCTURE_REPAIR' : 'SOP_CRITICAL_RESPONSE',
        status: 'PENDING_APPROVAL',
        steps,
        pendingApproval: 'RESOURCE_DEPLOYMENT'
      }
    });

    console.log(`[WorkflowEngine] Created Workflow ${workflow.id}. Status: PENDING_APPROVAL.`);
    return workflow;
  } catch (error) {
    console.error('[WorkflowEngine] Failed to create workflow:', error);
    return null;
  }
};

export const approveWorkflowStep = async (workflowId: string, stepAction: string) => {
  const workflow = await prisma.workflowExecution.findUnique({ where: { id: workflowId } });
  if (!workflow) throw new Error("Workflow not found");

  const updatedSteps = (workflow.steps as any[]).map(step => {
    if (step.action === stepAction) {
      return { ...step, status: "COMPLETED", timestamp: new Date() };
    }
    return step;
  });

  const allCompleted = updatedSteps.every(s => s.status === "COMPLETED");

  return await prisma.workflowExecution.update({
    where: { id: workflowId },
    data: {
      steps: updatedSteps,
      status: allCompleted ? 'COMPLETED' : 'ACTIVE',
      pendingApproval: allCompleted ? null : workflow.pendingApproval
    }
  });
};
