"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var prompt_sync_1 = require("prompt-sync");
var agenda_1 = require("./classes/agenda");
var paciente_1 = require("./classes/paciente");
/* TODO: FUNCIONALIDADES FALTANTES:
   1. Não permitir inserir CPF duplicado
   1.1. Não permitir inserir CPF inválido
   2. Não permitir inserir uma data anterior ao dia de hoje no agendamento
   3. Validar a data inserida.
*/
var prompt = (0, prompt_sync_1.default)();
var agenda = new agenda_1.default();
var pacientes = [];
function menuPrincipal() {
    var option;
    do {
        console.log("\nMenu Principal");
        console.log("1 - Cadastro de pacientes");
        console.log("2 - Agenda");
        console.log("3 - Sair");
        option = parseInt(prompt("Escolha uma opção: "));
        switch (option) {
            case 1:
                cadastrarPaciente();
                break;
            case 2:
                menuAgenda();
                break;
            case 3:
                console.log("Encerrando o programa...");
                break;
            default:
                console.log("Opção inválida, tente novamente.");
        }
    } while (option !== 3);
}
function cadastrarPaciente() {
    try {
        var cpf = prompt("Informe o CPF: ");
        var isDuplicate = false;
        for (var i = 0; i < pacientes.length; i++) {
            if (pacientes[i].getCpf() == cpf) {
                throw new Error("CPF já cadastrado");
            }
        }
        var nome = prompt("Informe o nome: ");
        var dataNasc = new Date(prompt("Informe a data de nascimento (YYYY-MM-DD): "));
        if (isNaN(dataNasc.getTime())) {
            throw new Error("Data de Nascimento inválida");
        }
        var dataAtual = new Date();
        if (dataNasc > dataAtual) {
            throw new Error("Data de Nascimento no futuro não é permitida");
        }
        var paciente = paciente_1.default.criarPaciente(cpf, nome, dataNasc);
        if (paciente) {
            pacientes.push(paciente);
            console.log("Paciente criado com sucesso!");
            return paciente;
        }
        else {
            return null;
        }
    }
    catch (error) {
        console.log("Erro ao cadastrar paciente: " +
            (error instanceof Error ? error.message : error));
        return null;
    }
}
function menuAgenda() {
    var option;
    do {
        console.log("\nAgenda");
        console.log("1 - Agendar consulta");
        console.log("2 - Listar agenda");
        console.log("3 - Voltar para o menu principal");
        option = parseInt(prompt("Escolha uma opção: "));
        switch (option) {
            case 1:
                var paciente = null;
                if (pacientes.length != 0) {
                    var pacienteExistente = prompt("Deseja vincular um paciente já existente ao agendamento? (Y/N): ");
                    if (pacienteExistente == "Y") {
                        var indexPaciente = parseInt(prompt("Insira o index do paciente que deseja marcar a consulta: "));
                        if (indexPaciente <= pacientes.length) {
                            paciente = pacientes[indexPaciente];
                        }
                        else {
                            console.log("Index do paciente inválido");
                        }
                    }
                    else {
                        paciente = cadastrarPaciente();
                    }
                }
                else {
                    console.log("Nenhum paciente registrado no sistema, criando novo paciente.");
                    paciente = cadastrarPaciente();
                }
                if (paciente) {
                    var dataConsulta = new Date(prompt("Informe a data da consulta (YYYY-MM-DD): "));
                    if (dataConsulta < new Date()) {
                        throw new Error("Data Inválida: Consulta com dia anterior a data de hoje");
                    }
                    var horaInicial = prompt("Informe a hora inicial (HH:mm): ");
                    var horaFinal = prompt("Informe a hora final (HH:mm): ");
                    agenda.agendarConsulta({
                        paciente: paciente,
                        data_consulta: dataConsulta,
                        hora_inicial: horaInicial,
                        hora_final: horaFinal,
                    });
                    console.log("Consulta agendada com sucesso!");
                    break;
                }
                else {
                    console.log("Paciente está null, impossível finalizar o agendamento. Retornando para o menu: ");
                    break;
                }
            case 2:
                console.log("Listando agenda...");
                agenda.printAgendaFormatada();
                break;
            case 3:
                console.log("Voltando ao menu principal...");
                break;
            default:
                console.log("Opção inválida, tente novamente.");
        }
    } while (option !== 3);
}
// Inicia o programa
menuPrincipal();
