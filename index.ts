import PromptSync from "prompt-sync";
import Agenda from "./classes/agenda";
import Paciente from "./classes/paciente";

/*  TODO: Implementar testes? */
const prompt = PromptSync();
const agenda = new Agenda();
var pacientes: Paciente[] = [];

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

function agendamentoConsulta(): void {
  try {
    var paciente: Paciente | null = null;
    if (pacientes.length != 0) {
      const pacienteExistente = prompt(
        "Deseja vincular um paciente já existente ao agendamento? (Y/N): ",
      );
      if (pacienteExistente == "Y") {
        console.log("Pacientes Cadastrados: ");
        for (let i = 0; i < pacientes.length; i++) {
          console.log(`Index: ${i}, Nome: ${pacientes[i].getNome()};`);
        }

        const indexPaciente = parseInt(
          prompt("Insira o index do paciente que deseja marcar a consulta: "),
        );
        if (indexPaciente <= pacientes.length) {
          paciente = pacientes[indexPaciente];
        } else {
          console.log("Index do paciente inválido");
        }
      } else {
        paciente = cadastrarPaciente();
      }
    } else {
      console.log(
        "Nenhum paciente registrado no sistema, criando novo paciente.",
      );
      paciente = cadastrarPaciente();
    }
    if (paciente) {
      const dataConsulta = new Date(
        prompt("Informe a data da consulta (YYYY-MM-DD): "),
      );

      if (dataConsulta < new Date()) {
        throw new Error(
          "Data Inválida: Consulta com dia anterior a data de hoje",
        );
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
    } else {
      console.log(
        "Paciente está null, impossível finalizar o agendamento. Retornando para o menu: ",
      );
    }
  } catch (err) {
    console.log(err);
  }
}

function isCpfDuplicado(pacientes, cpf): boolean {
  for (let i = 0; i < pacientes.length; i++) {
    if (pacientes[i].getCpf() == cpf) {
      return true;
    }
  }
  return false;
}

function isCpfValido(cpf): boolean {
  let newCpf = cpf.replace(/[^\d]+/g, "");
  if (newCpf.length !== 11 || /^(\d)\1+$/.test(newCpf)) return false;

  let sum = 0;
  let remainder;

  for (let i = 1; i <= 9; i++) {
    sum += parseInt(newCpf.substring(i - 1, i)) * (11 - i);
  }
  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(newCpf.substring(9, 10))) return false;

  sum = 0;
  for (let i = 1; i <= 10; i++) {
    sum += parseInt(newCpf.substring(i - 1, i)) * (12 - i);
  }
  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  return remainder === parseInt(newCpf.substring(10, 11));
}

function formatarCpf(cpf) {
  cpf = cpf.replace(/[^\d]+/g, "");
  return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
}

function nomeTemTamanhoMinimo(nome): boolean {
  return nome.length > Paciente.NOME_TAMANHO_MINIMO;
}

function formataData(data): boolean {}

function validaData(data: Date): boolean {
  return isNaN(data);
}

function validaIdadeMinima(idade): boolean {
  return idade > 13;
}

function cadastrarPaciente() {
  try {
    let cpfValido: boolean = false;
    let nomeValido: boolean = false;
    let dataValida: boolean = false;
    let IdadeValida: boolean = false;

    let cpf = prompt("Informe um CPF válido: ");
    while (!cpfValido) {
      cpf = formatarCpf(cpf);

      if (!isCpfValido(cpf)) {
        console.log("CPF não é válido");
        continue;
      }

      if (isCpfDuplicado(pacientes, cpf)) {
        console.log("CPF já cadastrado");
        continue;
      }

      cpfValido = true;
    }


    let nome = prompt("Informe o nome: ");
    while (!nomeValido) {
      if (!nomeTemTamanhoMinimo(nome)) {
        console.log(
          `Nome deve ter no mínimo ${Paciente.NOME_TAMANHO_MINIMO} caracteres `,
        );
        continue;
      }

      nomeValido = true;
    }

    const dataNasc = new Date(prompt("Informe a data de nascimento (DD-MM-YYYY): "));
    const dataAtual = new Date();

    while (!dataValida) {

      if (!validaData(dataNasc)) {
        console.log("Data de Nascimento inválida");
        continue;
      }

      if (dataNasc > dataAtual) {
        console.log("Data de Nascimento não pode ser após a data presente.");
        continue;
      }

      dataValida = true;
    }

    const paciente = Paciente.criarPaciente(cpf, nome, dataNasc);
    if (paciente) {
      pacientes.push(paciente);
      console.log("Paciente criado com sucesso!");
      return paciente;
    } else {
      return null;
    }
  } catch (error) {
    console.log(
      "Erro ao cadastrar paciente: " +
        (error instanceof Error ? error.message : error),
    );
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
        agendamentoConsulta();
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
