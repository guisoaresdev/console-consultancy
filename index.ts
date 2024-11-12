import PromptSync from "prompt-sync";
import Agenda from "./classes/agenda";
import Paciente from "./classes/paciente";

/* TODO: FUNCIONALIDADES FALTANTES:
   1. Conseguir vincular um paciente existente a um agendamento 
   2. Não permitir inserir CPF duplicado
   3. Não permitir inserir uma data anterior ao dia de hoje no agendamento
*/

const prompt = PromptSync();
const agenda = new Agenda();

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
    const nome = prompt("Informe o nome: ");
    const dataNasc = new Date(
      prompt("Informe a data de nascimento (YYYY-MM-DD): "),
    );

    const paciente = new Paciente(cpf, nome, dataNasc);
    console.log("Paciente cadastrado com sucesso!");
    return paciente;
  } catch (error) {
    console.log(`Erro ao cadastrar paciente: ${error}`);
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
        const paciente = cadastrarPaciente();
        if (paciente) {
          const dataConsulta = new Date(
            prompt("Informe a data da consulta (YYYY-MM-DD): "),
          );
          const horaInicial = prompt("Informe a hora inicial (HH:mm): ");
          const horaFinal = prompt("Informe a hora final (HH:mm): ");

          agenda.agendarConsulta({
            paciente,
            data_consulta: dataConsulta,
            hora_inicial: horaInicial,
            hora_final: horaFinal,
          });
          console.log("Consulta agendada com sucesso!");
        }
        break;
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
