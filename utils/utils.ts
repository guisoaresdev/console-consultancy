export function isCpfDuplicado(pacientes, cpf): boolean {
  let isDuplicated: boolean = false;
  for (let i = 0; i < pacientes.length; i++) {
    if (pacientes[i].getCpf() == cpf) {
      isDuplicated = true;
    }
  }
  return isDuplicated;
}

export function isCpfValido(cpf): boolean {
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

export function formatarCpf(cpf) {
  cpf = cpf.replace(/[^\d]+/g, "");
  return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
}

export function nomeTemTamanhoMinimo(nome, tamanho_minimo_nome): boolean {
  return nome.length > tamanho_minimo_nome;
}

export function validaFormatoData(data: string): boolean {
  // Regex pra validar data no formato DD/MM/ANO
  const regex = /^(\d{2})\/(\d{2})\/(\d{4})$/;

  return regex.test(data);
}

export function formataData(dataStr) {
  const [dia, mes, ano] = dataStr.split("/").map(Number);
  return new Date(ano, mes - 1, dia);
}

export function validaData(data: Date | null): boolean {
  // Verifica se a data é válida
  return data !== null && !isNaN(data.getTime());
}

export function validaIdadeMinima(data_nasc) {
  const hoje = new Date();
  let idade = hoje.getFullYear() - data_nasc.getFullYear();
  const mes = hoje.getMonth() - data_nasc.getMonth();
  if (mes < 0 || (mes === 0 && hoje.getDate() < data_nasc.getDate())) {
    idade--;
  }
  return idade > 13;
}

export function validarHorario(horario: string): boolean {
  const regex = /^([01]\d|2[0-3]):([0-5]\d)$/; // Formato HH:mm, com horas de 00 a 23 e minutos de 00 a 59
  return regex.test(horario);
}

export function validarDisponibilidadeHorario(horario: string): boolean {
  if (!validarHorario(horario)) return false; // Primeiro, valida o formato

  const [, horas, minutos] = horario.match(/^(\d{2}):(\d{2})$/) || [];
  const minutosInt = parseInt(minutos, 10);

  // Verifica se os minutos são múltiplos de 15
  return minutosInt % 15 === 0;
}

export function validarHoraAgendamento(
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
