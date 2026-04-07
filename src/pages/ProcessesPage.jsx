import React from "react";
import Card from "../components/common/Card.jsx";
import EmptyState from "../components/common/EmptyState.jsx";
import DetailSection from "../components/common/DetailSection.jsx";
import MiniDonut from "../components/common/MiniDonut.jsx";

export default function ProcessesPage(props) {
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

      return (
        <section className="two-col process-layout">
          <Card
            title="Processos internos"
            subtitle="Abas expostas para tramitação, encerrados e arquivados. Movimentações do processo atualizam a ocorrência vinculada."
            action={
              <div className="process-header-tools">
                <div className="process-tabs-vertical">
                  {["Em tramitação", "Encerrados", "Arquivados"].map((tab) => (
                    <button
                      key={tab}
                      className={`tab-btn ${processBoardView === tab ? "active" : ""}`}
                      onClick={() => {
                        setProcessBoardView(tab);
                        setSelectedProcessId(null);
                      }}
                    >
                      {tab} <span className="tab-count">{processCounts[tab]}</span>
                    </button>
                  ))}
                </div>
                <input className="search-input" placeholder="Buscar processo" value={processSearch} onChange={(e) => setProcessSearch(e.target.value)} />
              </div>
            }
          >
            <div className="list">
              {processSummary.length === 0 ? (
                <EmptyState
                  title={processBoardView === "Em tramitação" ? "Nenhum processo em tramitação" : processBoardView === "Encerrados" ? "Nenhum processo encerrado" : "Nenhum processo arquivado"}
                  text={processBoardView === "Em tramitação" ? "Os processos em andamento aparecerão aqui. Clique nas abas acima para consultar encerrados ou arquivados." : "Nenhum processo encontrado nesta aba no momento."}
                />
              ) : processSummary.map((item) => (
                <div className="list-item vertical" key={item.id}>
                  <div className="process-top">
                    <div>
                      <button className="plain-link" onClick={() => {
                        setSelectedProcessId(item.id);
                        if (!expandedProcessIds.includes(item.id)) {
                          setExpandedProcessIds((prev) => [...prev, item.id]);
                        }
                      }}>{item.numero}</button>
                      <p>{item.assunto}</p>
                      <small>{item.funcionarioNome}</small>
                      <div className="detail-inline compact-chips">
                        <span>Vinculado a {item.occurrenceNumber || "-"}</span>
                        <span>Classificação: {item.classificacao || "-"}</span>
                        <span>Atribuído: {queueTargetLabel(item.assignedTo)}</span>
                        {item.sigiloso ? <span>Sigiloso</span> : null}
                        {item.awaitingResponse ? <span>Pendência ativa</span> : null}
                      </div>
                    </div>
                    <div className="inline-actions">
                      <Badge tone={getCriticalityTone(item.classificacao)}>{getCriticalityLabel(item.classificacao)}</Badge>
                      <Badge tone={getStatusTone(item.status)}>{item.status}</Badge>
                      <button className="btn secondary mini" onClick={() => {
                        const isExpanded = expandedProcessIds.includes(item.id);
                        if (isExpanded) {
                          setExpandedProcessIds((prev) => prev.filter((x) => x !== item.id));
                          if (selectedProcessId === item.id) setSelectedProcessId(null);
                        } else {
                          setSelectedProcessId(item.id);
                          setExpandedProcessIds((prev) => [...prev, item.id]);
                        }
                      }}>
                        {expandedProcessIds.includes(item.id) ? "Recolher" : "Expandir"}
                      </button>
                    </div>
                  </div>

                  {expandedProcessIds.includes(item.id) ? (
                    <div className="detail-panel">
                      <DetailSection title="Cabeçalho do processo" subtitle="Informações institucionais do PAI e enquadramento.">
                        {item.status === "Arquivado" ? (
                          <div className="deadline-alert">
                            <strong>Processo arquivado.</strong> O fluxo está bloqueado até eventual desarquivamento.
                            <div style={{ marginTop: 10 }}>
                              <button className="btn secondary mini" onClick={() => unarchiveProcess(item.id)}>Desarquivar processo</button>
                            </div>
                          </div>
                        ) : item.status === "Encerrado" ? (
                          <div className="deadline-ok">
                            Processo encerrado. As movimentações estão bloqueadas e o registro permanece apenas para acompanhamento.
                          </div>
                        ) : item.awaitingResponse ? (
                          <div className="deadline-alert">
                            <strong>Pendência ativa:</strong> aguardando {item.awaitingType || "resposta"}{String(item.awaitingType || "").toLowerCase().includes("despacho") ? ` do setor ${queueTargetLabel(item.assignedTo)}` : ""} até {item.responseDeadline ? `${item.responseDeadline.slice(11,16)} de ${formatDate(item.responseDeadline.slice(0,10))}` : "-"}.
                            <div style={{ marginTop: 10 }}>
                              <button className="btn secondary mini" onClick={() => {
                                if (String(item.awaitingType || "").toLowerCase().includes("despacho")) {
                                  clearResponseWindow(item.id, "Pendência de despacho marcada manualmente como cumprida. Fluxo liberado.", "Em apuração");
                                } else {
                                  clearResponseWindow(item.id, "Pendência marcada manualmente como cumprida. Processo aguardando despacho.", "Aguardando despacho");
                                  applyWorkflowAfterMovement(item.id, "Manifestação do funcionário");
                                }
                              }}>
                                Marcar pendência como cumprida
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="deadline-ok">Fluxo liberado para prosseguimento. {item.status === "Aguardando despacho" ? `Processo aguardando despacho de ${queueTargetLabel(item.assignedTo)}.` : ""}</div>
                        )}
                        <div className="detail-grid">
                          <div><label>Assunto</label><input value={item.assunto} onChange={(e) => { setSelectedProcessId(item.id); updateSelectedProcess("assunto", e.target.value); }} /></div>
                          <div><label>Status</label><select value={item.status} onChange={(e) => { setSelectedProcessId(item.id); updateSelectedProcess("status", e.target.value); }}>{PROCESS_STATUS.map((s) => <option key={s}>{s}</option>)}</select></div>
                          <div><label>Prazo</label><input type="date" value={item.prazo} onChange={(e) => { setSelectedProcessId(item.id); updateSelectedProcess("prazo", e.target.value); }} /></div>
                          <div><label>Ocorrência vinculada</label><input value={item.occurrenceNumber || "-"} readOnly /></div>
                          <div><label>Classificação</label><input value={item.classificacao || "-"} readOnly /></div>
                          <div><label>Norma violada</label><input value={item.normaViolada || "-"} readOnly /></div>
                          <div><label>Sigilo</label><input value={item.sigiloso ? "Sim" : "Não"} readOnly /></div>
                          <div>
                            <label>Atribuir despacho para</label>
                            <select
                              value={Object.prototype.hasOwnProperty.call(processAssignmentDrafts, item.id) ? processAssignmentDrafts[item.id] : (item.assignedTo || "")}
                              onChange={(e) => {
                                const nextValue = e.target.value;
                                setProcessAssignmentDrafts((prev) => ({ ...prev, [item.id]: nextValue }));
                              }}
                            >
                              <option value="">Não atribuído</option>
                              <option value="RH">RH</option>
                              <option value="Jurídico">Jurídico</option>
                              <option value="Gestão">Gestão</option>
                            </select>
                          </div>
                          <div>
                            <label>Salvar atribuição</label>
                            <button className="btn secondary" type="button" onClick={() => { setSelectedProcessId(item.id); saveProcessAssignment(item.id); }}>
                              Salvar
                            </button>
                            <small>Atribuição atual: {queueTargetLabel(item.assignedTo)}</small>
                          </div>
                        </div>
                      </DetailSection>

                      <DetailSection title="Ações processuais" subtitle="Atalhos agrupados para reduzir ruído visual e manter fluidez institucional.">
                        <div className="action-groups">
                          {item.status === "Arquivado" ? (
                            <>
                              <div className="action-group">
                                <div className="action-group-title">Relatórios</div>
                                <div className="row-actions">
                                  <button className="btn secondary mini" onClick={() => printOccurrenceReport({ ...occurrences.find((o) => o.id === item.occurrenceId), processoForcado: item })}>Gerar relatório PDF</button>
                                </div>
                              </div>
                              {currentUser?.perfil !== "Jurídico" ? (
                                <div className="action-group">
                                  <div className="action-group-title">Controle</div>
                                  <div className="row-actions">
                                    <button className="btn secondary mini" onClick={() => unarchiveProcess(item.id)}>Desarquivar</button>
                                    <button className="btn ghost mini" onClick={() => deleteProcess(item.id)}>Excluir</button>
                                  </div>
                                </div>
                              ) : null}
                            </>
                          ) : item.status === "Encerrado" ? (
                            <div className="action-group">
                              <div className="action-group-title">Relatórios</div>
                              <div className="row-actions">
                                <button className="btn secondary mini" onClick={() => printOccurrenceReport({ ...occurrences.find((o) => o.id === item.occurrenceId), processoForcado: item })}>Gerar relatório PDF</button>
                              </div>
                            </div>
                          ) : (
                            <>
                              {currentUser?.perfil !== "Jurídico" ? (
                              <div className="action-group">
                                <div className="action-group-title">Prazos e comunicações</div>
                                <div className="row-actions">
                                  <button className="btn secondary mini" onClick={() => startResponseWindow(item.id, "ciência/notificação do colaborador", "Notificação ao colaborador", 48, 0)}>Notificar colaborador</button>
                                  <button className="btn secondary mini" onClick={() => startResponseWindow(item.id, "defesa inicial", "Prazo de defesa inicial", 48, 0)}>Abrir defesa 48h</button>
                                  <button className="btn secondary mini" onClick={() => startResponseWindow(item.id, "defesa final", "Defesa final", 0, 3)}>Abrir defesa final</button>
                                </div>
                              </div>
                              ) : null}

                              <div className="action-group">
                                <div className="action-group-title">Peças e documentos padrão</div>
                                <div className="detail-grid">
                                  <div className="full">
                                    <label>Selecione a peça padrão</label>
                                    <select
                                      value={standardDocSelection[item.id] || ""}
                                      onChange={(e) => setStandardDocSelection((prev) => ({ ...prev, [item.id]: e.target.value }))}
                                    >
                                      <option value="">Selecione uma peça</option>
                                      {standardDocumentOptions(item).map((doc) => (
                                        <option key={doc.key} value={doc.key}>{doc.label}</option>
                                      ))}
                                    </select>
                                  </div>
                                </div>
                                <div className="row-actions">
                                  <button className="btn secondary mini" onClick={() => addProcessMovement(item.id, "Relatório final", "Relatório final elaborado com síntese dos fatos, provas e enquadramento.")}>Emitir relatório final</button>
                                  <button
                                    className="btn secondary mini"
                                    onClick={() => {
                                      const selected = standardDocSelection[item.id];
                                      if (!selected) {
                                        alert("Selecione uma peça padrão.");
                                        return;
                                      }
                                      openStandardDocumentEditor(item, selected);
                                    }}
                                  >
                                    Gerar peça selecionada
                                  </button>
                                  <button className="btn secondary mini" onClick={() => printOccurrenceReport({ ...occurrences.find((o) => o.id === item.occurrenceId), processoForcado: item })}>Gerar relatório PDF</button>
                                </div>
                              </div>

                              {currentUser?.perfil !== "Jurídico" ? (
                              <div className="action-group">
                                <div className="action-group-title">Encerramento e controle</div>
                                <div className="row-actions">
                                  <button className="btn secondary mini" onClick={() => closeProcess(item.id)}>Encerrar</button>
                                  <button className="btn secondary mini" onClick={() => archiveProcess(item.id)}>Arquivar</button>
                                  <button className="btn ghost mini" onClick={() => deleteProcess(item.id)}>Excluir</button>
                                </div>
                              </div>
                              ) : null}
                            </>
                          )}
                        </div>
                      </DetailSection>

                      <DetailSection title="Movimentações" subtitle="Linha formal do processo e manifestações.">
                        {item.status === "Encerrado" || item.status === "Arquivado" ? (
                          <div className="muted-box">
                            {item.status === "Encerrado"
                              ? "Processo encerrado. As movimentações estão bloqueadas e o registro permanece apenas para acompanhamento."
                              : "Processo arquivado. Desarquive o processo para voltar a movimentá-lo."}
                          </div>
                        ) : (
                        <div className="movement-box">
                          <div className="movement-header"><h3>Nova movimentação</h3></div>
                          <div className="detail-grid">
                            <div>
                              <label>Tipo</label>
                              <select value={selectedProcessId === item.id ? movementType : movementOptions[0]} onChange={(e) => { setSelectedProcessId(item.id); setMovementType(e.target.value); }}>
                                {movementOptions.map((opt) => <option key={opt}>{opt}</option>)}
                              </select>
                            </div>
                            {selectedProcessId === item.id && movementType === "Decisão" ? (
                              <>
                                <label className="checkbox simple-box">
                                  <input type="checkbox" checked={decisionConclusion} onChange={(e) => setDecisionConclusion(e.target.checked)} />
                                  Decisão conclusiva
                                </label>
                                {decisionConclusion ? (
                                  <>
                                    <div>
                                      <label>Resultado</label>
                                      <select value={decisionResult} onChange={(e) => setDecisionResult(e.target.value)}>
                                        <option>sem penalidade</option>
                                        <option>advertência verbal</option>
                                        <option>advertência escrita</option>
                                        <option>suspensão</option>
                                        <option>encaminhamento para justa causa</option>
                                      </select>
                                    </div>
                                    <div>
                                      <label>Token da chefia</label>
                                      <input type="password" value={decisionToken} onChange={(e) => setDecisionToken(e.target.value)} placeholder="Senha/token da chefia" />
                                    </div>
                                  </>
                                ) : <div></div>}
                              </>
                            ) : null}
                            {selectedProcessId === item.id && movementType === "Manifestação do RH" ? (
                              <>
                                <label className="checkbox simple-box">
                                  <input type="checkbox" checked={hrConclusion} onChange={(e) => setHrConclusion(e.target.checked)} />
                                  Manifestação conclusiva do RH
                                </label>
                                {hrConclusion ? (
                                  <div>
                                    <label>Token do RH/chefia</label>
                                    <input type="password" value={hrToken} onChange={(e) => setHrToken(e.target.value)} placeholder="Senha/token para concluir" />
                                  </div>
                                ) : <div></div>}
                              </>
                            ) : null}
                            {selectedProcessId === item.id && (movementType === "Despacho do RH" || movementType === "Despacho jurídico") ? (
                              <label className="checkbox simple-box">
                                <input type="checkbox" checked={dispatchConclusion} onChange={(e) => setDispatchConclusion(e.target.checked)} />
                                Despacho conclusivo
                              </label>
                            ) : null}
                            {selectedProcessId === item.id && movementType !== "Notificação ao colaborador" ? (
                              <>
                                <label className="checkbox simple-box">
                                  <input type="checkbox" checked={movementOpenSectorDeadline} onChange={(e) => setMovementOpenSectorDeadline(e.target.checked)} />
                                  Abrir prazo interno para o setor atribuído
                                </label>
                                {movementOpenSectorDeadline ? (
                                  <div>
                                    <label>Prazo interno (dias)</label>
                                    <input
                                      type="number"
                                      min="1"
                                      value={movementDeadlineDays}
                                      onChange={(e) => setMovementDeadlineDays(e.target.value)}
                                      placeholder="Ex.: 2"
                                    />
                                  </div>
                                ) : <div></div>}
                              </>
                            ) : null}
                            <div className="full">
                              <label>Texto</label>
                              <textarea rows={4} value={selectedProcessId === item.id ? movementText : ""} onChange={(e) => { setSelectedProcessId(item.id); setMovementText(e.target.value); }} placeholder="Digite a movimentação processual." />
                            </div>
                            <div className="full">
                              <label>Anexos desta movimentação</label>
                              <label className="upload-btn">
                                Adicionar anexo ao movimento
                                <input
                                  type="file"
                                  accept={DOCUMENT_ACCEPT}
                                  onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                      setSelectedProcessId(item.id);
                                      queueMovementAttachment(item.id, file);
                                    }
                                    e.target.value = "";
                                  }}
                                />
                              </label>
                              {(movementAttachmentDrafts[item.id] || []).length > 0 ? (
                                <div className="draft-attachment-list">
                                  {(movementAttachmentDrafts[item.id] || []).map((doc) => (
                                    <div className="draft-attachment-item" key={doc.id}>
                                      <span>{doc.name}</span>
                                      <button className="btn ghost mini" onClick={() => removeMovementDraftAttachment(item.id, doc.id)}>Remover</button>
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <div className="muted-box">Nenhum anexo preparado para esta movimentação.</div>
                              )}
                            </div>
                          </div>
                          <button className="btn primary" type="button" onClick={() => { setSelectedProcessId(item.id); addMovement(); }}>Registrar movimentação</button>
                        </div>
                        )}

                        <div className="timeline">
                          {(item.movimentacoes || []).map((mv) => {
                            const movementDocs = getMovementAttachments(item.id, mv.id);
                            return (
                            <div className="timeline-item" key={mv.id}>
                              <div className="timeline-dot"></div>
                              <div className="timeline-content">
                                <div className="process-top">
                                  <div>
                                    <strong>{mv.tipo}</strong>
                                    <small>{mv.data}</small>
                                    {mv.responsavel ? <small>{mv.responsavel}</small> : null}
                                  </div>
                                  <label className="upload-btn mini-upload">
                                    Anexar a este movimento
                                    <input
                                      type="file"
                                      accept={DOCUMENT_ACCEPT}
                                      onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (file) {
                                          handleUploadAttachment("process", item.id, file, "Documento vinculado", {
                                            movementId: mv.id,
                                            movementType: mv.tipo,
                                            movementText: mv.texto
                                          });
                                        }
                                        e.target.value = "";
                                      }}
                                    />
                                  </label>
                                </div>
                                <p>{mv.texto}</p>
                                {movementDocs.length > 0 ? (
                                  <div className="timeline-docs">
                                    {movementDocs.map((doc) => (
                                      <button key={doc.id} className="doc-chip" onClick={() => setPreviewAttachment(doc)}>
                                        {doc.name}
                                      </button>
                                    ))}
                                  </div>
                                ) : null}
                              </div>
                            </div>
                          )})}
                        </div>
                      </DetailSection>

                      {renderProcessAttachmentBlock(item)}
                    </div>
                  ) : null}
                </div>
              ))}
            </div>
          </Card>

          <Card title="Leitura consolidada" subtitle="Selecione um processo na coluna ao lado para leitura limpa e detalhada.">
            {!selectedProcess ? (
              <EmptyState title="Nenhum processo selecionado" text="Selecione um processo na coluna da esquerda. As abas acima organizam em tramitação, encerrados e arquivados." />
            ) : (
              <div className="detail-panel no-top-line">
                <div className="detail-grid">
                  <div><label>Número</label><input value={selectedProcess.numero} readOnly /></div>
                  <div><label>Status</label><input value={selectedProcess.status} readOnly /></div>
                  <div className="full"><label>Assunto</label><input value={selectedProcess.assunto} readOnly /></div>
                  <div><label>Funcionário</label><input value={employeeMap[selectedProcess.funcionarioId]?.nome || "-"} readOnly /></div>
                  <div><label>Ocorrência vinculada</label><input value={selectedProcess.occurrenceNumber || "-"} readOnly /></div>
                  <div><label>Classificação</label><input value={selectedProcess.classificacao || "-"} readOnly /></div>
                  <div><label>Norma violada</label><input value={selectedProcess.normaViolada || "-"} readOnly /></div>
                  <div><label>Sigilo</label><input value={selectedProcess.sigiloso ? "Sim" : "Não"} readOnly /></div>
                </div>

                {selectedProcess.awaitingResponse ? (
                  <div className="deadline-alert">
                    <strong>Pendência ativa:</strong> aguardando {selectedProcess.awaitingType || "resposta"}{String(selectedProcess.awaitingType || "").toLowerCase().includes("despacho") ? ` do setor ${queueTargetLabel(selectedProcess.assignedTo)}` : ""} até {selectedProcess.responseDeadline ? `${selectedProcess.responseDeadline.slice(11,16)} de ${formatDate(selectedProcess.responseDeadline.slice(0,10))}` : "-"}.
                    <div style={{ marginTop: 10 }}>
                      <button className="btn secondary mini" onClick={() => {
                        if (String(selectedProcess.awaitingType || "").toLowerCase().includes("despacho")) {
                          clearResponseWindow(selectedProcess.id, "Pendência de despacho marcada manualmente como cumprida. Fluxo liberado.", "Em apuração");
                        } else {
                          clearResponseWindow(selectedProcess.id, "Pendência marcada manualmente como cumprida. Processo aguardando despacho.", "Aguardando despacho");
                          applyWorkflowAfterMovement(selectedProcess.id, "Manifestação do funcionário", false, internalDays);
                        }
                      }}>
                        Marcar pendência como cumprida
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="deadline-ok">Fluxo liberado para prosseguimento. {selectedProcess.status === "Aguardando despacho" ? `Processo aguardando despacho de ${queueTargetLabel(selectedProcess.assignedTo)}.` : ""}</div>
                )}
                <div className="timeline">
                  {(selectedProcess.movimentacoes || []).map((mv) => {
                    const movementDocs = getMovementAttachments(selectedProcess.id, mv.id);
                    return (
                    <div className="timeline-item" key={mv.id}>
                      <div className="timeline-dot"></div>
                      <div className="timeline-content">
                        <strong>{mv.tipo}</strong>
                        <small>{mv.data}</small>
                        {mv.responsavel ? <small>{mv.responsavel}</small> : null}
                        <p>{mv.texto}</p>
                        {movementDocs.length > 0 ? (
                          <div className="timeline-docs">
                            {movementDocs.map((doc) => (
                              <button key={doc.id} className="doc-chip" onClick={() => setPreviewAttachment(doc)}>
                                {doc.name}
                              </button>
                            ))}
                          </div>
                        ) : null}
                      </div>
                    </div>
                  )})}
                </div>
              </div>
            )}
          </Card>
        </section>
      );
  
}
