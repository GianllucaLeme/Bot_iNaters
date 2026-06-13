const { carregarGruposPausados, salvarGruposPausados } = require('../lib/utils');

// Funções para gerenciar o estado de pausa dos grupos
let gruposPausados = carregarGruposPausados();

function estaPausado(groupId) {
    return !!gruposPausados[groupId];
}

function pausarGrupo(groupId) {
    gruposPausados[groupId] = true;
    salvarGruposPausados(gruposPausados);
}

function despausarGrupo(groupId) {
    delete gruposPausados[groupId];
    salvarGruposPausados(gruposPausados);
}

function obterGruposPausados() {
    return gruposPausados;
}

module.exports = { estaPausado, pausarGrupo, despausarGrupo, obterGruposPausados };