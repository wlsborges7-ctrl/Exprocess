import React from "react";
import Card from "../components/common/Card.jsx";
import EmptyState from "../components/common/EmptyState.jsx";
import DetailSection from "../components/common/DetailSection.jsx";
import MiniDonut from "../components/common/MiniDonut.jsx";

export default function EmployeesPage(props) {
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
        <section className={showEmployeeForm ? "two-col wide-left" : "single-col"}>
          <Card
            title="Funcionários"
            subtitle="Tela mais limpa: o formulário só aparece quando solicitado, liberando espaço para consulta."
            action={
              <div className="toolbar-inline">
                {!showEmployeeForm ? (
                  <button className="btn primary" onClick={() => { resetEmployeeForm(); setShowEmployeeForm(true); }}>
                    Novo funcionário
                  </button>
                ) : null}
                {showEmployeeForm ? (
                  <button className="btn secondary" onClick={resetEmployeeForm}>
                    Fechar formulário
                  </button>
                ) : null}
              </div>
            }
          >
            {showEmployeeForm ? (
              <form className="form-grid" onSubmit={handleEmployeeSubmit}>
                <input placeholder="Nome completo" value={employeeForm.nome} onChange={(e) => setEmployeeForm({ ...employeeForm, nome: e.target.value })} required />
                <input placeholder="CPF" value={employeeForm.cpf} onChange={(e) => setEmployeeForm({ ...employeeForm, cpf: e.target.value })} required />
                <input placeholder="Matrícula" value={employeeForm.matricula} onChange={(e) => setEmployeeForm({ ...employeeForm, matricula: e.target.value })} required />
                <input placeholder="Cargo" value={employeeForm.cargo} onChange={(e) => setEmployeeForm({ ...employeeForm, cargo: e.target.value })} required />
                <input type="number" min="0" step="0.01" placeholder="Salário base" value={employeeForm.salario} onChange={(e) => setEmployeeForm({ ...employeeForm, salario: e.target.value })} />
                <select value={employeeForm.setor} onChange={(e) => setEmployeeForm({ ...employeeForm, setor: e.target.value })}>
                  {DEPARTMENTS.map((item) => <option key={item}>{item}</option>)}
                </select>
                <input placeholder="Base / unidade" value={employeeForm.base} onChange={(e) => setEmployeeForm({ ...employeeForm, base: e.target.value })} />
                <input placeholder="Gestor imediato" value={employeeForm.gestor} onChange={(e) => setEmployeeForm({ ...employeeForm, gestor: e.target.value })} />
                <select value={employeeForm.status} onChange={(e) => setEmployeeForm({ ...employeeForm, status: e.target.value })}>
                  {STATUS_OPTIONS.map((status) => <option key={status}>{status}</option>)}
                </select>
                <div>
                  <label>Data de admissão</label>
                  <input type="date" value={employeeForm.admissao} onChange={(e) => setEmployeeForm({ ...employeeForm, admissao: e.target.value })} />
                </div>
                <input type="email" placeholder="E-mail" value={employeeForm.email} onChange={(e) => setEmployeeForm({ ...employeeForm, email: e.target.value })} />
                <input placeholder="Celular" value={employeeForm.celular} onChange={(e) => setEmployeeForm({ ...employeeForm, celular: e.target.value })} />
                <div className="cep-grid full">
                  <input placeholder="CEP" value={employeeForm.cep} onChange={(e) => setEmployeeForm({ ...employeeForm, cep: e.target.value })} />
                  <button type="button" className="btn secondary" onClick={lookupCep}>Consultar CEP</button>
                </div>
                <input placeholder="Logradouro" value={employeeForm.endereco} onChange={(e) => setEmployeeForm({ ...employeeForm, endereco: e.target.value })} />
                <input placeholder="Número" value={employeeForm.numero} onChange={(e) => setEmployeeForm({ ...employeeForm, numero: e.target.value })} />
                <input placeholder="Complemento" value={employeeForm.complemento} onChange={(e) => setEmployeeForm({ ...employeeForm, complemento: e.target.value })} />
                <input placeholder="Bairro" value={employeeForm.bairro} onChange={(e) => setEmployeeForm({ ...employeeForm, bairro: e.target.value })} />
                <input placeholder="Cidade" value={employeeForm.cidade} onChange={(e) => setEmployeeForm({ ...employeeForm, cidade: e.target.value })} />
                <input placeholder="UF" value={employeeForm.uf} onChange={(e) => setEmployeeForm({ ...employeeForm, uf: e.target.value })} />
                <div className="form-actions full">
                  {employeeEditingId ? <button type="button" className="btn secondary" onClick={resetEmployeeForm}>Cancelar edição</button> : null}
                  <button className="btn primary" type="submit">{employeeEditingId ? "Salvar alterações" : "Salvar funcionário"}</button>
                </div>
              </form>
            ) : (
              <EmptyState title="Formulário recolhido" text="Clique em “Novo funcionário” para abrir o cadastro ou em “Editar” em um registro existente." />
            )}
          </Card>

          <Card
            title="Funcionários cadastrados"
            subtitle="Consulta rápida com expansão de detalhes e botão de edição."
            action={
              <div className="toolbar-inline">
                <input className="search-input" placeholder="Buscar funcionário" value={employeeSearch} onChange={(e) => setEmployeeSearch(e.target.value)} />
                <select className="small-filter" value={employeeStatusFilter} onChange={(e) => setEmployeeStatusFilter(e.target.value)}>
                  <option>Todos</option>
                  {STATUS_OPTIONS.map((status) => <option key={status}>{status}</option>)}
                </select>
                <select className="small-filter" value={employeeSortOrder} onChange={(e) => setEmployeeSortOrder(e.target.value)}>
                  <option value="nome_asc">Nome A-Z</option>
                  <option value="nome_desc">Nome Z-A</option>
                  <option value="matricula_asc">Matrícula crescente</option>
                  <option value="matricula_desc">Matrícula decrescente</option>
                  <option value="setor">Setor</option>
                  <option value="status">Status</option>
                </select>
              </div>
            }
          >
            <div className="list">
              {filteredEmployees.map((employee) => (
                <div className="list-item vertical" key={employee.id}>
                  <div className="process-top">
                    <div>
                      <strong>{employee.nome}</strong>
                      <p>{employee.cargo} · {employee.setor}</p>
                    </div>
                    <div className="inline-actions">
                      <Badge tone={getStatusTone(employee.status)}>{employee.status}</Badge>
                      <button className="btn secondary mini" onClick={() => toggleExpanded(employee.id, expandedEmployeeIds, setExpandedEmployeeIds)}>
                        {expandedEmployeeIds.includes(employee.id) ? "Recolher" : "Expandir"}
                      </button>
                      <button className="btn secondary mini" onClick={() => startEmployeeEdit(employee)}>Editar</button>
                      <button className="btn ghost mini" onClick={() => handleEmployeeDelete(employee.id)}>Excluir</button>
                    </div>
                  </div>
                  <small className="soft">Dias afastado: {employee.diasAfastamento || 0} · INSS: {inssByEmployee[employee.id]?.shouldRefer ? "Encaminhar" : "Sem alerta"}</small>
                  {expandedEmployeeIds.includes(employee.id) ? (
                    <div className="detail-panel">
                      <div className="employee-actions">
                        <button className="btn mini primary" onClick={() => {
                          setActivePage("Ocorrências");
                          setOccurrenceForm(prev => ({...prev, funcionarioId: employee.id, tipo: "Outras ocorrências"}));
                        }}>Ocorrência rápida</button>
                        <button className="btn mini secondary" onClick={() => {
                          setActivePage("Ocorrências");
                          setOccurrenceForm(prev => ({...prev, funcionarioId: employee.id, tipo: "Atestado"}));
                        }}>Atestado</button>
                        <button className="btn mini secondary" onClick={() => {
                          setActivePage("Ocorrências");
                          setOccurrenceForm(prev => ({...prev, funcionarioId: employee.id, tipo: "Folga meritória"}));
                        }}>Folga meritória</button>
                        <button className="btn mini secondary" onClick={() => {
                          setActivePage("Desligamentos");
                          setTerminationForm(prev => ({...prev, funcionarioId: employee.id}));
                        }}>Desligamento</button>
                      </div>

                      <div className="detail-tabs">
                        {["dados", "ocorrências", "processos"].map((tab) => (
                          <button
                            key={tab}
                            className={`tab-btn ${((employeeDetailTabs[employee.id] || "dados") === tab) ? "active" : ""}`}
                            onClick={() => setEmployeeDetailTabs((prev) => ({ ...prev, [employee.id]: tab }))}
                          >
                            {tab === "dados" ? "Dados" : tab === "ocorrências" ? "Ocorrências" : "Processos"}
                          </button>
                        ))}
                      </div>

                      {(employeeDetailTabs[employee.id] || "dados") === "dados" ? (
                        <div className="detail-grid">
                          <div><label>Matrícula</label><input value={employee.matricula} readOnly /></div>
                          <div><label>CPF</label><input value={employee.cpf} readOnly /></div>
                          <div><label>E-mail</label><input value={employee.email || "-"} readOnly /></div>
                          <div><label>Celular</label><input value={employee.celular || "-"} readOnly /></div>
                          <div><label>Base</label><input value={employee.base || "-"} readOnly /></div>
                          <div><label>Gestor</label><input value={employee.gestor || "-"} readOnly /></div>
                          <div className="full"><label>Endereço</label><input value={`${employee.endereco || ""}, ${employee.numero || ""} ${employee.complemento ? "- " + employee.complemento : ""} - ${employee.bairro || ""} - ${employee.cidade || ""}/${employee.uf || ""} - CEP ${employee.cep || ""}`} readOnly /></div>
                        </div>
                      ) : null}

                      {(employeeDetailTabs[employee.id] || "dados") === "ocorrências" ? (
                        <div className="list compact-list">
                          {occurrences.filter((item) => item.funcionarioId === employee.id).length === 0 ? (
                            <EmptyState title="Sem ocorrências" text="As ocorrências vinculadas a este funcionário aparecerão aqui." />
                          ) : occurrences.filter((item) => item.funcionarioId === employee.id).map((item) => (
                            <div className="list-item vertical" key={item.id}>
                              <div className="process-top">
                                <div>
                                  <strong>{item.protocolo}</strong>
                                  <p>{item.tipo}</p>
                                </div>
                                <div className="inline-actions">
                                  <Badge tone={getCriticalityTone(item.classificacao)}>{getCriticalityLabel(item.classificacao)}</Badge>
                                  <Badge tone={getStatusTone(item.status)}>{item.status}</Badge>
                                </div>
                              </div>
                              <small className="soft">{formatDate(item.data)}</small>
                              <p>{item.descricao}</p>
                            </div>
                          ))}
                        </div>
                      ) : null}

                      {(employeeDetailTabs[employee.id] || "dados") === "processos" ? (
                        <div className="list compact-list">
                          {processes.filter((item) => item.funcionarioId === employee.id).length === 0 ? (
                            <EmptyState title="Sem processos" text="Os processos vinculados a este funcionário aparecerão aqui." />
                          ) : processes.filter((item) => item.funcionarioId === employee.id).map((item) => (
                            <div className="list-item vertical" key={item.id}>
                              <div className="process-top">
                                <div>
                                  <strong>{item.numero}</strong>
                                  <p>{item.assunto}</p>
                                </div>
                                <div className="inline-actions">
                                  <Badge tone={getCriticalityTone(item.classificacao)}>{getCriticalityLabel(item.classificacao)}</Badge>
                                  <Badge tone={getStatusTone(item.status)}>{item.status}</Badge>
                                </div>
                              </div>
                              <small className="soft">Ocorrência: {item.occurrenceNumber || "-"}</small>
                            </div>
                          ))}
                        </div>
                      ) : null}
                    </div>
                  ) : null}
                </div>
              ))}
            </div>
          </Card>
        </section>
      );
  
}
