import PromptSync from "prompt-sync";
import Agenda from "./classes/agenda";
import Paciente from "./classes/paciente";

/*  TODO: TODO: */
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

function agendarConsulta(): void {
  var validaDataConsulta: boolean = false;
  var validaHorarioInicial: boolean = false;
  var validaHorarioFinal: boolean = false;
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
      var dataConsulta: Date;
      var dataConsultaStr = prompt("Informe a data da consulta (DD/MM/YYYY): ");

      while (!validaDataConsulta) {
        if (!validaFormatoData(dataConsultaStr)) {
          console.log("Data deve ser no formato DD/MM/YYYY");
          dataConsultaStr = prompt("Informe a data da consulta (DD/MM/YYYY): ");
          continue;
        }

        dataConsulta = formataData(dataConsultaStr);
        if (!validaData(dataConsulta)) {
          console.log("Data da consulta inválida");
          dataConsultaStr = prompt("Informe a data da consulta (DD/MM/YYYY): ");
          continue;
        }

        if (dataConsulta < new Date()) {
          console.log( "Data Inválida: Consulta com dia anterior a data de hoje");
          dataConsultaStr = prompt("Informe a data da consulta (DD/MM/YYYY): ");
          continue;
        }

        validaDataConsulta = true;
      }
      var horaInicial = prompt("Informe a hora inicial (HH:mm): ");
      while (!validaHorarioInicial) {
        if (!validarHorario(horaInicial)) {
          console.log("As horas devem ser no formato HH:mm");
          horaInicial = prompt("Informe a hora inicial (HH:mm): ");
          continue;
        }

        if (!validarDisponibilidadeHorario(horaInicial)) {
          console.log( "Os horários disponíveis são de 15 em 15 minutos. Ex: 20:00, 20:15, 20:30");
          horaInicial = prompt("Informe a hora inicial (HH:mm): ");
          continue;
        }

        validaHorarioInicial = true;
      }

      var horaFinal = prompt("Informe a hora final (HH:mm): ");
      while (!validaHorarioFinal) {
        if (!validarHorario(horaFinal)) {
          console.log("As horas devem ser no formato HH:mm");
          horaFinal = prompt("Informe a hora inicial (HH:mm): ");
          continue;
        }

        if (!validarDisponibilidadeHorario(horaFinal)) {
          console.log( "Os horários disponíveis são de 15 em 15 minutos. Ex: 20:00, 20:15, 20:30");
          horaFinal = prompt("Informe a hora inicial (HH:mm): ");
          continue;
        }

        if (!validarHoraAgendamento(horaInicial, horaFinal)) {
          console.log("O horário final é anterior ao horário inicial");
          horaFinal = prompt("Informe a hora inicial (HH:mm): ");
          continue;
        }
        validaHorarioFinal = true;
      }

      agenda.agendarConsulta({
        paciente: paciente,
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
  let isDuplicated: boolean = false;
  for (let i = 0; i < pacientes.length; i++) {
    if (pacientes[i].getCpf() == cpf) {
      isDuplicated = true;
    }
  }
  return isDuplicated;
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

function validaFormatoData(data: string): boolean {
  // Regex pra validar data no formato DD/MM/ANO
  const regex = /^(\d{2})\/(\d{2})\/(\d{4})$/;

  return regex.test(data);
}

function formataData(dataStr) {
  const [dia, mes, ano] = dataStr.split("/").map(Number);
  return new Date(ano, mes - 1, dia); // Meses no JavaScript são baseados em zero
}

function validaData(data: Date | null): boolean {
  // Verifica se a data é válida
  return data !== null && !isNaN(data.getTime());
}

function validaIdadeMinima(data_nasc) {
  const hoje = new Date();
  let idade = hoje.getFullYear() - data_nasc.getFullYear();
  const mes = hoje.getMonth() - data_nasc.getMonth();
  if (mes < 0 || (mes === 0 && hoje.getDate() < data_nasc.getDate())) {
    idade--;
  }
  return idade > 13;
}

function validarHorario(horario: string): boolean {
  const regex = /^([01]\d|2[0-3]):([0-5]\d)$/; // Formato HH:mm, com horas de 00 a 23 e minutos de 00 a 59
  return regex.test(horario);
}

function validarDisponibilidadeHorario(horario: string): boolean {
  if (!validarHorario(horario)) return false; // Primeiro, valida o formato

  const [, horas, minutos] = horario.match(/^(\d{2}):(\d{2})$/) || [];
  const minutosInt = parseInt(minutos, 10);

  // Verifica se os minutos são múltiplos de 15
  return minutosInt % 15 === 0;
}

function validarHoraAgendamento(
  horaInicial: string,
  horaFinal: string,
): boolean {
  if (!validarHorario(horaInicial) || !validarHorario(horaFinal)) return false;

  const [horasInicial, minutosInicial] = horaInicial.split(":").map(Number);
  const [horasFinal, minutosFinal] = horaFinal.split(":").map(Number);

  const totalMinutosInicial = horasInicial * 60 + minutosInicial;
  const totalMinutosFinal = horasFinal * 60 + minutosFinal;

  return totalMinutosFinal > totalMinutosInicial;
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
        cpf = prompt("Informe um CPF válido: ");
        continue;
      }

      if (isCpfDuplicado(pacientes, cpf)) {
        console.log("CPF já cadastrado");
        cpf = prompt("Informe um CPF válido: ");
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
        nome = prompt("Informe o nome: ");
        continue;
      }

      nomeValido = true;
    }

    const dataAtual = new Date();
    var dataNasc = new Date();

    var dataNascStr = prompt("Informe a data de nascimento (DD/MM/YYYY): ");
    while (!dataValida) {
      if (!validaFormatoData(dataNascStr)) {
        console.log("Data deve ser no formato DD/MM/YYYY");
        dataNascStr = prompt("Informe a data de nascimento (DD/MM/YYYY): ");
        continue;
      }

      dataNasc = formataData(dataNascStr);
      if (!validaData(dataNasc)) {
        console.log("Data de Nascimento inválida");
        dataNascStr = prompt("Informe a data de nascimento (DD/MM/YYYY): ");
        continue;
      }

      if (!validaIdadeMinima(dataNasc)) {
        console.log("Paciente deve ter no mínimo 13 anos de idade");
        dataNascStr = prompt("Informe a data de nascimento (DD/MM/YYYY): ");
        continue;
      }

      if (dataNasc > dataAtual) {
        console.log("Data de Nascimento não pode ser após a data presente.");
        dataNascStr = prompt("Informe a data de nascimento (DD/MM/YYYY): ");
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
        agendarConsulta();
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
