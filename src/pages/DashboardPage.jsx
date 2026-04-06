import React from "react";

export default function DashboardPage(props) {
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
    Card,
    EmptyState,
    DetailSection,
    MiniDonut,
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

      return (
        <>
          <header className="hero">
            {DEMO_MODE ? <div className="demo-badge">MODO DEMONSTRAÇÃO</div> : null}
            <div>
              <h1>Dashboard</h1>
              <p>Indicadores visuais de pessoal e andamento operacional para a versão de entrega local.</p>
            </div>
            <div className="hero-actions">
              <button className="btn secondary" onClick={() => setActivePage("Funcionários")}>Novo funcionário</button>
              <button className="btn primary" onClick={() => setActivePage("Ocorrências")}>Nova ocorrência</button>
            </div>
          </header>

          <section className="stats-grid">
            {stats.map((item) => (
              <div className="stat-card" key={item.label}>
                <span>{item.label}</span>
                <strong>{item.value}</strong>
              </div>
            ))}
          </section>

          <section className="chart-grid">
            <Card title="Panorama de pessoal" subtitle="Leitura rápida de afastados e suspensos.">
              <div className="mini-charts">
                <MiniDonut value={totalAway} total={totalEmployees} label="afastados" />
                <MiniDonut value={totalSusp} total={totalEmployees} label="suspensos" />
              </div>
            </Card>
            <Card title="Status dos processos" subtitle="Distribuição dos processos cadastrados.">
              <div className="bars">
                {PROCESS_STATUS.map((status) => {
                  const count = processes.filter((p) => p.status === status).length;
                  const max = Math.max(1, processes.length);
                  return (
                    <div className="bar-row" key={status}>
                      <span>{status}</span>
                      <div className="bar-track"><div className="bar-fill" style={{ width: `${(count / max) * 100}%` }}></div></div>
                      <strong>{count}</strong>
                    </div>
                  );
                })}
              </div>
            </Card>
          </section>

          <section className="chart-grid">
            <Card title="Minha fila de despacho" subtitle={`Processos aguardando despacho atribuídos para ${myQueueTarget || "seu perfil"}.`}>
              {myDispatchQueue.length === 0 ? (
                <EmptyState title="Nenhum processo na fila" text="Não há processos aguardando despacho para o seu perfil neste momento." />
              ) : (
                <div className="list compact-list">
                  {myDispatchQueue.map((item) => (
                    <div className="list-item vertical" key={item.id}>
                      <div className="process-top">
                        <div>
                          <strong>{item.numero}</strong>
                          <p>{item.assunto}</p>
                          <small>{employeeMap[item.funcionarioId]?.nome || "-"}</small>
                        </div>
                        <button className="btn secondary mini" onClick={() => { setActivePage("Processos Internos"); setSelectedProcessId(item.id); setExpandedProcessIds((prev) => prev.includes(item.id) ? prev : [...prev, item.id]); }}>
                          Abrir
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
            <Card title="Processos por setor" subtitle="Total de processos atribuídos e quantos estão aguardando despacho.">
              <div className="list compact-list">
                <div className="list-item"><strong>RH</strong><Badge>{assignedBySectorCounts["RH"]}</Badge><small>Aguardando despacho: {awaitingDispatchBySectorCounts["RH"]}</small></div>
                <div className="list-item"><strong>Jurídico</strong><Badge>{assignedBySectorCounts["Jurídico"]}</Badge><small>Aguardando despacho: {awaitingDispatchBySectorCounts["Jurídico"]}</small></div>
                <div className="list-item"><strong>Gestão</strong><Badge>{assignedBySectorCounts["Gestão"]}</Badge><small>Aguardando despacho: {awaitingDispatchBySectorCounts["Gestão"]}</small></div>
              </div>
            </Card>
          </section>
        </>
      );
  
}
