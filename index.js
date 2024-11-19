import PromptSync from "prompt-sync";
import Agenda from "./classes/agenda";
import Paciente from "./classes/paciente";
/*  TODO: Implementar testes? */
const prompt = PromptSync();
const agenda = new Agenda();
var pacientes = [];
function menuPrincipal() {
    let option;
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
        const cpf = prompt("Informe o CPF: ");
        let isDuplicate = false;
        for (let i = 0; i < pacientes.length; i++) {
            if (pacientes[i].getCpf() == cpf) {
                throw new Error("CPF já cadastrado");
            }
        }
        const nome = prompt("Informe o nome: ");
        const dataNasc = new Date(prompt("Informe a data de nascimento (YYYY-MM-DD): "));
        if (isNaN(dataNasc.getTime())) {
            throw new Error("Data de Nascimento inválida");
        }
        const dataAtual = new Date();
        if (dataNasc > dataAtual) {
            throw new Error("Data de Nascimento no futuro não é permitida");
        }
        const paciente = Paciente.criarPaciente(cpf, nome, dataNasc);
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
    let option;
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
                    const pacienteExistente = prompt("Deseja vincular um paciente já existente ao agendamento? (Y/N): ");
                    if (pacienteExistente == "Y") {
                        const indexPaciente = parseInt(prompt("Insira o index do paciente que deseja marcar a consulta: "));
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
                    const dataConsulta = new Date(prompt("Informe a data da consulta (YYYY-MM-DD): "));
                    if (dataConsulta < new Date()) {
                        throw new Error("Data Inválida: Consulta com dia anterior a data de hoje");
                    }
                    const horaInicial = prompt("Informe a hora inicial (HH:mm): ");
                    const horaFinal = prompt("Informe a hora final (HH:mm): ");
                    agenda.agendarConsulta({
                        paciente,
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
