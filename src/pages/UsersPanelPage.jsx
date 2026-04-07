import React from "react";
import Card from "../components/common/Card.jsx";
import EmptyState from "../components/common/EmptyState.jsx";
import DetailSection from "../components/common/DetailSection.jsx";
import MiniDonut from "../components/common/MiniDonut.jsx";

export default function UsersPanelPage(props) {
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

      if (currentUser?.perfil !== "Administrador") return null;
      return (
        <section className="two-col">
          <Card title="Criar usuário" subtitle="Gestão simples de acessos da solução.">
            <form className="form-grid" onSubmit={handleCreateUser}>
              <input placeholder="Nome" value={userForm.nome} onChange={(e) => setUserForm({ ...userForm, nome: e.target.value })} />
              <input placeholder="Usuário" value={userForm.usuario} onChange={(e) => setUserForm({ ...userForm, usuario: e.target.value })} />
              <select value={userForm.perfil} onChange={(e) => setUserForm({ ...userForm, perfil: e.target.value })}>
                {PROFILE_OPTIONS.map((item) => <option key={item}>{item}</option>)}
              </select>
              <div className="password-wrap">
                <input
                  type={showUserPassword ? "text" : "password"}
                  placeholder="Senha"
                  value={userForm.senha}
                  onChange={(e) => setUserForm({ ...userForm, senha: e.target.value })}
                />
                <button type="button" className="eye-btn" onClick={() => setShowUserPassword((v) => !v)}>
                  {showUserPassword ? "Ocultar" : "Mostrar"}
                </button>
              </div>
              <label className="checkbox simple-box">
                <input type="checkbox" checked={userForm.ativo} onChange={(e) => setUserForm({ ...userForm, ativo: e.target.checked })} />
                Usuário ativo
              </label>
              <div className="form-actions full">
                <button className="btn primary" type="submit">Criar usuário</button>
              </div>
            </form>
          </Card>

          <Card title="Usuários cadastrados" subtitle="Perfis, permissões e primeiro acesso.">
            <div className="list compact-list">
              {safeUsers.map((item) => {
                const perms = getUserPermissions(item);
                return (
                  <div className="list-item vertical" key={item.id}>
                    <div className="process-top">
                      <div>
                        <strong>{item.nome}</strong>
                        <p>{item.usuario} · {item.perfil}</p>
                      </div>
                      <div className="inline-actions">
                        <Badge tone={item.ativo ? "success" : "muted"}>{item.ativo ? "Ativo" : "Inativo"}</Badge>
                        <Badge tone={item.mustChangePassword ? "warning" : "success"}>{item.mustChangePassword ? "Troca de senha pendente" : "Senha ok"}</Badge>
                        {item.id !== currentUser?.id ? (
                          <button className="btn secondary mini" onClick={() => toggleUserActive(item.id)}>
                            {item.ativo ? "Inativar" : "Ativar"}
                          </button>
                        ) : null}
                        {item.id !== currentUser?.id ? (
                          <button className="btn ghost mini" onClick={() => deleteUser(item.id)}>
                            Excluir
                          </button>
                        ) : null}
                        <button className="btn secondary mini" onClick={() => setEditingPermissionsId(editingPermissionsId === item.id ? null : item.id)}>
                          {editingPermissionsId === item.id ? "Fechar permissões" : "Permissões"}
                        </button>
                      </div>
                    </div>
                    {editingPermissionsId === item.id ? (
                      <div className="detail-grid">
                        <div>
                          <label>Perfil</label>
                          <select value={item.perfil} onChange={(e) => updateUserAccess(item.id, { perfil: e.target.value })}>
                            {PROFILE_OPTIONS.map((opt) => <option key={opt}>{opt}</option>)}
                          </select>
                        </div>
                        <label className="checkbox simple-box"><input type="checkbox" checked={!!perms.canEmployees} onChange={(e) => updateUserPermission(item.id, "canEmployees", e.target.checked)} /> Funcionários</label>
                        <label className="checkbox simple-box"><input type="checkbox" checked={!!perms.canOccurrences} onChange={(e) => updateUserPermission(item.id, "canOccurrences", e.target.checked)} /> Ocorrências</label>
                        <label className="checkbox simple-box"><input type="checkbox" checked={!!perms.canProcesses} onChange={(e) => updateUserPermission(item.id, "canProcesses", e.target.checked)} /> Processos</label>
                        <label className="checkbox simple-box"><input type="checkbox" checked={!!perms.canTerminations} onChange={(e) => updateUserPermission(item.id, "canTerminations", e.target.checked)} /> Desligamentos</label>
                        <label className="checkbox simple-box"><input type="checkbox" checked={!!perms.processControl} onChange={(e) => updateUserPermission(item.id, "processControl", e.target.checked)} /> Controle processual</label>
                        <label className="checkbox simple-box"><input type="checkbox" checked={!!perms.canHrDispatch} onChange={(e) => updateUserPermission(item.id, "canHrDispatch", e.target.checked)} /> Despacho do RH</label>
                        <label className="checkbox simple-box"><input type="checkbox" checked={!!perms.canLegalDispatch} onChange={(e) => updateUserPermission(item.id, "canLegalDispatch", e.target.checked)} /> Despacho jurídico</label>
                        <label className="checkbox simple-box"><input type="checkbox" checked={!!perms.canConclusiveDecision} onChange={(e) => updateUserPermission(item.id, "canConclusiveDecision", e.target.checked)} /> Conclusões/decisões</label>
                        <label className="checkbox simple-box"><input type="checkbox" checked={!!item.mustChangePassword} onChange={(e) => updateUserAccess(item.id, { mustChangePassword: e.target.checked })} /> Exigir troca de senha no próximo login</label>
                      </div>
                    ) : null}
                  </div>
                );
              })}
            </div>
          </Card>
        </section>
      );
  
}
