import React from "react";
import Card from "../components/common/Card.jsx";
import EmptyState from "../components/common/EmptyState.jsx";
import DetailSection from "../components/common/DetailSection.jsx";
import MiniDonut from "../components/common/MiniDonut.jsx";

export default function TerminationsPage(props) {
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

      const currentHelp = currentJustCauseHelp();
      const selectedEmployee = employeeMap[Number(terminationForm.funcionarioId)] || null;
      const terminationEstimate = selectedEmployee ? calculateTerminationEstimate(selectedEmployee, terminationForm.tipo, terminationForm.data, terminationForm.avisoPrevio) : null;
      if (!currentPermissions.canTerminations) {
        return <Card title="Acesso restrito" subtitle="Seu perfil não possui acesso ao módulo de desligamentos." />;
      }
      return (
        <section className="two-col wide-left">
          <Card title="Novo desligamento" subtitle="Fluxo próprio para dispensa ordinária, pedido de demissão e justa causa.">
            <form className="form-grid" onSubmit={handleTerminationSubmit}>
              <select value={terminationForm.funcionarioId} onChange={(e) => setTerminationForm({ ...terminationForm, funcionarioId: e.target.value })} required>
                <option value="">Selecione o funcionário</option>
                {normalizedEmployees.filter((item) => item.status !== "Demitido").map((item) => <option key={item.id} value={item.id}>{item.nome}</option>)}
              </select>
              <select value={terminationForm.tipo} onChange={(e) => setTerminationForm({ ...terminationForm, tipo: e.target.value })}>
                <option value="dispensa_ordinaria">Dispensa ordinária</option>
                <option value="pedido_demissao">Pedido de demissão</option>
                <option value="justa_causa">Dispensa por justa causa</option>
              </select>
              <input type="date" value={terminationForm.data} onChange={(e) => setTerminationForm({ ...terminationForm, data: e.target.value })} required />
              <input placeholder="Motivo resumido" value={terminationForm.motivo} onChange={(e) => setTerminationForm({ ...terminationForm, motivo: e.target.value })} />
              {terminationForm.tipo === "pedido_demissao" ? (
                <select value={terminationForm.avisoPrevio} onChange={(e) => setTerminationForm({ ...terminationForm, avisoPrevio: e.target.value })}>
                  <option value="cumprido">Aviso prévio cumprido</option>
                  <option value="descontado">Aviso prévio descontado</option>
                </select>
              ) : null}
              {terminationForm.tipo === "dispensa_ordinaria" ? (
                <select value={terminationForm.avisoPrevio} onChange={(e) => setTerminationForm({ ...terminationForm, avisoPrevio: e.target.value })}>
                  <option value="indenizado">Aviso prévio indenizado</option>
                  <option value="cumprido">Aviso prévio cumprido</option>
                </select>
              ) : null}
              {terminationForm.tipo === "justa_causa" ? (
                <>
                  <div className="full">
                    <label>Hipótese legal de justa causa</label>
                    <select value={terminationForm.hipotese} onChange={(e) => setTerminationForm({ ...terminationForm, hipotese: e.target.value })}>
                      {JUST_CAUSE_OPTIONS.map((item) => <option key={item.key} value={item.key}>{item.label}</option>)}
                    </select>
                  </div>
                  <div className="full tooltip-card">
                    <strong>Hipótese selecionada — resumo legal</strong>
                    <p>{currentHelp}</p>
                  </div>
                  <input placeholder="Norma interna violada" value={terminationForm.normaViolada} onChange={(e) => setTerminationForm({ ...terminationForm, normaViolada: e.target.value })} />
                  <input placeholder="Ocorrência de referência (opcional)" value={terminationForm.occurrenceRef} onChange={(e) => setTerminationForm({ ...terminationForm, occurrenceRef: e.target.value })} />
                  <input placeholder="Processo de referência (opcional)" value={terminationForm.processRef} onChange={(e) => setTerminationForm({ ...terminationForm, processRef: e.target.value })} />
                  <textarea className="full" rows={4} placeholder="Síntese do enquadramento e do fato" value={terminationForm.sintese} onChange={(e) => setTerminationForm({ ...terminationForm, sintese: e.target.value })} />
                  <input type="password" placeholder="Token da chefia" value={terminationToken} onChange={(e) => setTerminationToken(e.target.value)} />
                </>
              ) : null}
              {terminationEstimate && terminationForm.tipo !== "justa_causa" ? (
                <div className="full estimate-box">
                  <strong>Estimativa simplificada de rescisão</strong>
                  <p>Valores estimados, sujeitos à conferência contábil/fiscal.</p>
                  <div className="detail-grid">
                    <div><label>Salário base</label><input readOnly value={`R$ ${terminationEstimate.salario.toFixed(2)}`} /></div>
                    <div><label>Saldo de salário</label><input readOnly value={`R$ ${terminationEstimate.saldoSalario.toFixed(2)}`} /></div>
                    <div><label>13º proporcional</label><input readOnly value={`R$ ${terminationEstimate.decimoProporcional.toFixed(2)}`} /></div>
                    <div><label>Férias proporcionais + 1/3</label><input readOnly value={`R$ ${terminationEstimate.feriasProporcionais.toFixed(2)}`} /></div>
                    <div><label>Férias vencidas + 1/3</label><input readOnly value={`R$ ${terminationEstimate.feriasVencidas.toFixed(2)}`} /></div>
                    <div><label>Aviso prévio indenizado</label><input readOnly value={`R$ ${terminationEstimate.avisoIndenizado.toFixed(2)}`} /></div>
                    <div><label>Desconto aviso pedido</label><input readOnly value={`R$ ${terminationEstimate.descontoAvisoPedido.toFixed(2)}`} /></div>
                    <div><label>FGTS estimado</label><input readOnly value={`R$ ${terminationEstimate.fgtsBase.toFixed(2)}`} /></div>
                    <div><label>Multa FGTS</label><input readOnly value={`R$ ${terminationEstimate.multaFgts.toFixed(2)}`} /></div>
                    <div className="full"><label>Total estimado</label><input readOnly value={`R$ ${terminationEstimate.total.toFixed(2)}`} /></div>
                  </div>
                </div>
              ) : null}
              <div className="form-actions full">
                <button className="btn primary" type="submit">Registrar desligamento</button>
              </div>
            </form>
          </Card>

          <Card title="Desligamentos registrados" subtitle="Histórico dos desligamentos e processos de justa causa.">
            <div className="list">
              {terminations.length === 0 ? (
                <EmptyState title="Nenhum desligamento" text="Os desligamentos registrados aparecerão aqui." />
              ) : terminations.map((item) => {
                const process = processes.find((proc) => proc.id === item.processId);
                const hypothesis = JUST_CAUSE_OPTIONS.find((opt) => opt.key === item.hipotese);
                return (
                  <div className="list-item vertical" key={item.id}>
                    <div className="process-top">
                      <div>
                        <strong>{item.funcionarioNome}</strong>
                        <p>{item.tipo === "dispensa_ordinaria" ? "Dispensa ordinária" : item.tipo === "pedido_demissao" ? "Pedido de demissão" : "Justa causa"}</p>
                      </div>
                      <div className="inline-actions">
                        <Badge tone={item.status === "Concluído" ? "muted" : "warning"}>{item.status}</Badge>
                        {(item.tipo === "dispensa_ordinaria" || item.tipo === "pedido_demissao") ? (
                          <button className="btn secondary mini" onClick={() => printTerminationEstimateReport(item, employeeMap[item.funcionarioId])}>Gerar estimativa PDF</button>
                        ) : null}
                      </div>
                    </div>
                    <div className="detail-inline">
                      <span>Data: {formatDate(item.data)}</span>
                      {item.hipotese ? <span title={hypothesis?.help || ""}>Hipótese: {hypothesis?.label || "-"}</span> : null}
                      {process ? <span>Processo: {process.numero}</span> : null}
                    </div>
                    <p className="detail-text">{item.sintese || item.motivo || "Sem observações."}</p>
                    {renderAttachmentBlock("termination", item.id, "Documentos do desligamento", "Documento do desligamento")}
                  </div>
                );
              })}
            </div>
          </Card>
        </section>
      );
  
}
