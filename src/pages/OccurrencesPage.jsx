import React from "react";

export default function OccurrencesPage(props) {
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
        <section className="two-col wide-left">
          <Card title="Nova ocorrência" subtitle="Inclui “Outras ocorrências” e mantém campos específicos por tipo.">
            <form className="form-grid" onSubmit={handleOccurrenceSubmit}>
              <select value={occurrenceForm.tipo} onChange={(e) => setOccurrenceForm({ ...occurrenceForm, tipo: e.target.value })}>
                {OCCURRENCE_TYPES.map((type) => <option key={type}>{type}</option>)}
              </select>
              <select value={occurrenceForm.funcionarioId} onChange={(e) => setOccurrenceForm({ ...occurrenceForm, funcionarioId: e.target.value })} required>
                <option value="">Selecione o funcionário</option>
                {normalizedEmployees.map((item) => <option key={item.id} value={item.id}>{item.nome}</option>)}
              </select>
              <input type="date" value={occurrenceForm.data} onChange={(e) => setOccurrenceForm({ ...occurrenceForm, data: e.target.value })} required />
              <select value={occurrenceForm.classificacao} onChange={(e) => setOccurrenceForm({ ...occurrenceForm, classificacao: e.target.value })}>
                <option value="leve">leve</option>
                <option value="moderada">moderada</option>
                <option value="grave">grave</option>
                <option value="gravíssima">gravíssima</option>
              </select>
              <input placeholder="Norma violada (opcional)" value={occurrenceForm.normaViolada} onChange={(e) => setOccurrenceForm({ ...occurrenceForm, normaViolada: e.target.value })} />
              <label className="checkbox simple-box">
                <input type="checkbox" checked={occurrenceForm.geraProcesso} onChange={(e) => setOccurrenceForm({ ...occurrenceForm, geraProcesso: e.target.checked })} />
                Gerar processo interno
              </label>
              <textarea className="full" rows={4} placeholder="Descreva a ocorrência" value={occurrenceForm.descricao} onChange={(e) => setOccurrenceForm({ ...occurrenceForm, descricao: e.target.value })} required />
              {renderOccurrenceSpecificFields()}
              <div className="form-actions full">
                <button className="btn primary" type="submit">Salvar ocorrência</button>
              </div>
            </form>
          </Card>

          <Card
            title="Ocorrências cadastradas"
            subtitle="Com expansão, linha do tempo, classificação disciplinar e lançamentos rápidos úteis."
            action={
              <div className="toolbar-inline">
                <input className="search-input" placeholder="Buscar ocorrência" value={occurrenceSearch} onChange={(e) => setOccurrenceSearch(e.target.value)} />
                <select className="small-filter" value={occurrenceTypeFilter} onChange={(e) => setOccurrenceTypeFilter(e.target.value)}>
                  <option>Todos</option>
                  {OCCURRENCE_TYPES.map((type) => <option key={type}>{type}</option>)}
                </select>
              </div>
            }
          >
            <div className="list">
              {filteredOccurrences.map((item) => (
                <div className="list-item vertical" key={item.id}>
                  <div className="process-top">
                    <div>
                      <strong>{item.protocolo} · {item.tipo}</strong>
                      <p>{employeeMap[item.funcionarioId]?.nome || "Funcionário não localizado"}</p>
                    </div>
                    <div className="inline-actions">
                      <Badge tone={getCriticalityTone(item.classificacao)}>{getCriticalityLabel(item.classificacao)}</Badge>
                      <Badge tone={getStatusTone(item.status)}>{item.status}</Badge>
                      {item.status === "Arquivada" ? (
                        <button className="btn secondary mini" onClick={() => unarchiveOccurrence(item.id)}>Desarquivar</button>
                      ) : (
                        <button className="btn secondary mini" onClick={() => archiveOccurrence(item.id)}>Arquivar</button>
                      )}
                      <button className="btn secondary mini" onClick={() => toggleExpanded(item.id, expandedOccurrenceIds, setExpandedOccurrenceIds)}>
                        {expandedOccurrenceIds.includes(item.id) ? "Recolher" : "Expandir"}
                      </button>
                    </div>
                  </div>
                  <small>{formatDate(item.data)}</small>

                  {expandedOccurrenceIds.includes(item.id) ? (
                    <div className="detail-panel">
                      <DetailSection title="Dados da ocorrência" subtitle="Identificação, qualificação e leitura do fato.">
                        <p className="detail-text">{item.descricao}</p>
                        <div className="detail-inline">
                          <span>Classificação: {item.classificacao || "-"}</span>
                          <span>Norma violada: {item.normaViolada || "-"}</span>
                          <span>Status: {item.status || "-"}</span>
                        </div>
                        {item.atestado ? <div className="detail-inline"><span>CID: {item.atestado.informouCID ? (item.atestado.cidNumero || "Sim") : "Não"}</span><span>Hospital: {item.atestado.hospital || "-"}</span><span>CRM: {item.atestado.crmMedico || "-"}</span><span>Dias: {item.atestado.diasAfastamento || 0}</span></div> : null}
                        {item.penalidade ? <div className="detail-inline"><span>Efeito: {item.penalidade.efeito}</span><span>Dias: {item.penalidade.diasSuspensao || 0}</span></div> : null}
                        {item.dano ? <div className="detail-inline"><span>Ativo: {item.dano.ativo || "-"}</span><span>Serial: {item.dano.serial || "-"}</span><span>Local: {item.dano.local || "-"}</span><span>Valor: {item.dano.valorEstimado || "-"}</span><span>Impacto operacional: {item.dano.impactoOperacional ? "Sim" : "Não"}</span></div> : null}
                        {item.advertencia ? <div className="detail-inline"><span>Classificação advertência: {item.advertencia.classificacao}</span></div> : null}
                        {item.folga ? <div className="detail-inline"><span>Data da folga: {formatDate(item.folga.dataFolga)}</span><span>Validação chefia: {item.folga.validada ? "Confirmada" : "Pendente"}</span></div> : null}
                        {item.demanda ? <div className="detail-inline"><span>Prioridade: {item.demanda.prioridade}</span><span>Prazo pretendido: {formatDate(item.demanda.prazoPretendido)}</span><span>Unidade responsável: {item.demanda.unidadeResponsavel || "-"}</span></div> : null}
                        {item.outras ? <div className="detail-inline"><span>Título: {item.outras.titulo}</span></div> : null}
                      </DetailSection>

                      <DetailSection title="Linha do tempo" subtitle="Fatos e movimentos relacionados à ocorrência.">
                        <div className="timeline">
                          {(item.timeline || []).map((step) => (
                            <div className="timeline-item" key={step.id}>
                              <div className="timeline-dot"></div>
                              <div className="timeline-content">
                                <strong>{step.tipo}</strong>
                                <small>{step.data}</small>
                                {step.responsavel ? <small>{step.responsavel}</small> : null}
                                <p>{step.resumo}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </DetailSection>

                      {renderAttachmentBlock("occurrence", item.id, "Documentos da ocorrência", "Documento da ocorrência")}

                      <DetailSection title="Ações" subtitle="Lançamentos rápidos e conclusões.">
                        <div className="quick-box">
                          <div className="detail-grid">
                            <div>
                              <label>Lançamento rápido</label>
                              <select value={quickEventDrafts[item.id]?.type || "Movimentação"} onChange={(e) => setQuickEventDrafts((prev) => ({ ...prev, [item.id]: { ...(prev[item.id] || {}), type: e.target.value } }))}>
                                <option>Movimentação</option>
                                <option>Apresentação de documentos</option>
                                <option>Envio de notificação</option>
                                <option>Recebimento de resposta</option>
                                <option>Despacho interno</option>
                              </select>
                            </div>
                            <div className="full">
                              <label>Resumo</label>
                              <textarea rows={3} value={quickEventDrafts[item.id]?.text || ""} onChange={(e) => setQuickEventDrafts((prev) => ({ ...prev, [item.id]: { ...(prev[item.id] || {}), text: e.target.value } }))} placeholder="Digite o fato resumido a ser lançado na ocorrência e, se houver, no processo vinculado." />
                            </div>
                          </div>
                          <div className="row-actions">
                            <button className="btn secondary mini" onClick={() => quickRegisterOccurrenceEvent(item)}>Registrar fato rápido</button>
                            {!item.concluida ? <button className="btn secondary mini" onClick={() => concludeOccurrence(item.id)}>Concluir</button> : null}
                            <button className="btn secondary mini" onClick={() => printOccurrenceReport(item)}>Gerar relatório PDF</button>
                            <button className="btn ghost mini" onClick={() => deleteOccurrence(item.id)}>Excluir</button>
                          </div>
                        </div>
                      </DetailSection>
                    </div>
                  ) : null}
                </div>
              ))}
            </div>
          </Card>
        </section>
      );
  
}
