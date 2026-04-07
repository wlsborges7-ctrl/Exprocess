import React from "react";
import Card from "../components/common/Card.jsx";
import EmptyState from "../components/common/EmptyState.jsx";
import DetailSection from "../components/common/DetailSection.jsx";
import MiniDonut from "../components/common/MiniDonut.jsx";

export default function ReportsPage(props) {
  const {
    getProfilePermissions,
    getUserPermissions,
    getVisibleMenuForUser,
    getMovementOptionsForUser,
    actorLabel,
    getQueueTargetForProfile,
    queueTargetLabel,
    formatDate,
    parseDate,
    calculateINSSAlert,
    getStatusTone,
    getCriticalityTone,
    getCriticalityLabel,
    Badge,
    STORAGE_KEYS,
    API_BASE,
    STATUS_OPTIONS,
    DEPARTMENTS,
    OCCURRENCE_TYPES,
    PROCESS_STATUS,
    MENU,
    JUST_CAUSE_OPTIONS,
    DOCUMENT_ACCEPT,
    defaultUsers,
    PROFILE_OPTIONS,
    defaultEmployees,
    defaultOccurrences,
    defaultProcesses,
    loadStorage,
    ensureArray,
    nowBr,
    daysBetween,
    activePage,
    employees,
    occurrences,
    processes,
    selectedProcessId,
    users,
    session,
    authUser,
    loginForm,
    passwordChangeForm,
    loginError,
    showLoginPassword,
    userForm,
    showUserPassword,
    editingPermissionsId,
    documentDraft,
    backendRevision,
    backendUpdatedAt,
    syncNotice,
    remoteReady,
    syncTimeoutRef,
    pollIntervalRef,
    skipNextSyncRef,
    expandedEmployeeIds,
    employeeDetailTabs,
    expandedOccurrenceIds,
    expandedProcessIds,
    employeeSearch,
    occurrenceSearch,
    processSearch,
    employeeStatusFilter,
    occurrenceTypeFilter,
    processBoardView,
    employeeSortOrder,
    standardDocSelection,
    employeeEditingId,
    showEmployeeForm,
    employeeForm,
    occurrenceForm,
    attachments,
    previewAttachment,
    movementAttachmentDrafts,
    attachmentLinkDrafts,
    processAssignmentDrafts,
    terminationForm,
    terminations,
    quickEventDrafts,
    movementType,
    movementText,
    decisionConclusion,
    decisionResult,
    decisionToken,
    hrConclusion,
    hrToken,
    dispatchConclusion,
    terminationToken,
    movementOpenSectorDeadline,
    movementDeadlineDays,
    normalizedEmployees,
    employeeMap,
    processMapByOccurrence,
    selectedProcess,
    safeUsers,
    currentUser,
    currentPermissions,
    visibleMenu,
    movementOptions,
    inssByEmployee,
    totalEmployees,
    totalAway,
    totalSusp,
    stats,
    processCounts,
    filteredEmployees,
    filteredOccurrences,
    filteredProcesses,
    processSummary,
    myQueueTarget,
    myDispatchQueue,
    assignedBySectorCounts,
    awaitingDispatchBySectorCounts,
    toggleExpanded,
    lookupCep,
    resetEmployeeForm,
    startEmployeeEdit,
    handleEmployeeSubmit,
    handleEmployeeDelete,
    handleEmployeeStatusChange,
    applyOccurrenceEffects,
    isToday,
    validateManagerToken,
    requireValidToken,
    recalculateEmployeeStatus,
    appendOccurrenceEvent,
    appendProcessMovement,
    attachRecordsToMovement,
    queueMovementAttachment,
    removeMovementDraftAttachment,
    getMovementAttachments,
    linkAttachmentToMovement,
    syncOccurrenceToLinkedProcess,
    syncProcessToLinkedOccurrence,
    buildOccurrenceTimeline,
    handleOccurrenceSubmit,
    addOccurrenceTimeline,
    quickRegisterOccurrenceEvent,
    concludeOccurrence,
    deleteOccurrence,
    saveProcessAssignment,
    updateSelectedProcess,
    addProcessMovement,
    computeDeadlineFromNow,
    startResponseWindow,
    startSectorDeadline,
    clearResponseWindow,
    isMovementExpectedForPending,
    applyWorkflowAfterMovement,
    canLaunchMovement,
    addMovement,
    archiveOccurrence,
    unarchiveOccurrence,
    unarchiveProcess,
    closeProcess,
    archiveProcess,
    deleteProcess,
    printOccurrenceReport,
    getAttachments,
    handleUploadAttachment,
    removeAttachment,
    downloadAttachment,
    currentJustCauseHelp,
    handleTerminationSubmit,
    renderAttachmentBlock,
    renderProcessAttachmentBlock,
    resetDemoData,
    fetchBootstrap,
    pushSnapshot,
    handleLogin,
    handleLogout,
    renderLogin,
    getOccurrenceByProcess,
    generateStandardDocumentText,
    standardDocumentOptions,
    generateStandardDocument,
    handleCreateUser,
    deleteUser,
    toggleUserActive,
    updateUserAccess,
    updateUserPermission,
    handleFirstPasswordChange,
    renderUsersPanel,
    getDocumentTitle,
    openStandardDocumentEditor,
    printDocumentDraft,
    renderOccurrenceSpecificFields,
    renderDashboard,
    renderEmployees,
    renderOccurrences,
    renderProcesses,
    calculateTerminationEstimate,
    printTerminationEstimateReport,
    renderTerminations,
    renderReports,
  } = props;

      const employeesWithAlert = normalizedEmployees.filter((item) => inssByEmployee[item.id]?.shouldRefer);
      return (
        <section className="two-col">
          <Card title="Indicadores gerenciais" subtitle="Visão consolidada da operação local.">
            <div className="list">
              <div className="list-item"><strong>Total de funcionários</strong><Badge>{normalizedEmployees.length}</Badge></div>
              <div className="list-item"><strong>Funcionários afastados</strong><Badge tone="warning">{normalizedEmployees.filter((item) => item.status === "Afastado").length}</Badge></div>
              <div className="list-item"><strong>Funcionários suspensos</strong><Badge tone="danger">{normalizedEmployees.filter((item) => item.status === "Suspenso").length}</Badge></div>
              <div className="list-item"><strong>Alertas INSS</strong><Badge tone="danger">{employeesWithAlert.length}</Badge></div>
            </div>
          </Card>

          <Card title="Pendências previdenciárias" subtitle="Sinalização operacional para RH.">
            {employeesWithAlert.length === 0 ? (
              <EmptyState title="Nenhum alerta" text="Não há casos sinalizados para encaminhamento ao INSS." />
            ) : (
              <div className="list">
                {employeesWithAlert.map((employee) => (
                  <div className="list-item vertical" key={employee.id}>
                    <div className="process-top">
                      <strong>{employee.nome}</strong>
                      <Badge tone="danger">Encaminhar</Badge>
                    </div>
                    <p>{inssByEmployee[employee.id].message}</p>
                    <small>Dias afastado acumulados: {employee.diasAfastamento || 0}</small>
                  </div>
                ))}
              </div>
            )}
          </Card>

          <Card title="Processos por setor" subtitle="Consolidação das atribuições e da fila de despacho.">
            <div className="list compact-list">
              <div className="list-item"><strong>RH</strong><Badge>{assignedBySectorCounts["RH"]}</Badge><small>Aguardando despacho: {awaitingDispatchBySectorCounts["RH"]}</small></div>
              <div className="list-item"><strong>Jurídico</strong><Badge>{assignedBySectorCounts["Jurídico"]}</Badge><small>Aguardando despacho: {awaitingDispatchBySectorCounts["Jurídico"]}</small></div>
              <div className="list-item"><strong>Gestão</strong><Badge>{assignedBySectorCounts["Gestão"]}</Badge><small>Aguardando despacho: {awaitingDispatchBySectorCounts["Gestão"]}</small></div>
            </div>
          </Card>
        </section>
      );
  
}
