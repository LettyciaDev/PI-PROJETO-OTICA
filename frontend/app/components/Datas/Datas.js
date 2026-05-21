"use client"

import * as React from "react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { Calendar as CalendarIcon } from "lucide-react"
import { DayPicker } from "react-day-picker"
import "react-day-picker/dist/style.css"
import styles from "./Datas.module.css"

const HORARIO_MIN = "09:00"
const HORARIO_MAX = "18:30"

function horarioValido(h) {
  if (!h) return true
  return h >= HORARIO_MIN && h <= HORARIO_MAX
}

const dayPickerModifiersStyles = {
  selected: { backgroundColor: "#4B3220", color: "#f5ede0" },
  today:    { backgroundColor: "#e0d3be", color: "#4B3220", fontWeight: "bold" },
}

const dayPickerStyles = {
  caption:   { color: "#4B3220" },
  head_cell: { color: "#4B3220" },
}

export function Datas({
  value,
  onChange,
  horario,
  onHorarioChange,
  label = "Data de Visita",
}) {
  const [isOpen, setIsOpen] = React.useState(false)
  const [textoDigitado, setTextoDigitado] = React.useState("")
  const [horarioErro, setHorarioErro] = React.useState(false)
  const popoverRef = React.useRef(null)

  React.useEffect(() => {
    if (!value) { setTextoDigitado(""); return }
    if (typeof value === "string") {
      const [ano, mes, dia] = value.split("-").map(Number)
      setTextoDigitado(
        `${String(dia).padStart(2, "0")}/${String(mes).padStart(2, "0")}/${ano}`
      )
    } else {
      setTextoDigitado(format(value, "dd/MM/yyyy", { locale: ptBR }))
    }
  }, [value])

  function handleTexto(e) {
    const apenasNumeros = e.target.value.replace(/\D/g, "")
    let dia = apenasNumeros.slice(0, 2)
    let mes = apenasNumeros.slice(2, 4)
    let ano = apenasNumeros.slice(4, 8)

    if (dia.length === 2 && parseInt(dia) > 31) dia = "31"
    if (mes.length === 2 && parseInt(mes) > 12) mes = "12"
    if (ano.length === 4 && parseInt(ano) < 2026) ano = "2026"
    if (ano.length === 4 && parseInt(ano) > 2026) ano = "2026"

    let mascara = dia
    if (apenasNumeros.length > 2) mascara = dia + "/" + mes
    if (apenasNumeros.length > 4) mascara = dia + "/" + mes + "/" + ano

    setTextoDigitado(mascara)

    if (/^\d{2}\/\d{2}\/\d{4}$/.test(mascara)) {
      const d = new Date(parseInt(ano), parseInt(mes) - 1, parseInt(dia))
      if (!isNaN(d)) onChange(d)
    } else if (mascara === "") {
      onChange(undefined)
    }
  }

  function handleHorario(e) {
    const h = e.target.value
    onHorarioChange(h)
    setHorarioErro(!horarioValido(h))
  }

  function handleHorarioBlur(e) {
    const h = e.target.value
    if (!h) return
    if (h < HORARIO_MIN) {
      onHorarioChange(HORARIO_MIN)
      setHorarioErro(false)
    } else if (h > HORARIO_MAX) {
      onHorarioChange(HORARIO_MAX)
      setHorarioErro(false)
    }
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.dataBloco}>
        <label className={styles.label}>{label} <span style={{ color: 'red' }}>*</span></label>
        <div className={styles.field}>
          <input
            className={styles.input}
            type="text"
            inputMode="numeric"
            placeholder="dd/mm/aaaa"
            value={textoDigitado}
            onChange={handleTexto}
            maxLength={10}
          />
          <button
            type="button"
            className={styles.iconBtn}
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Abrir calendário"
          >
            <CalendarIcon className={styles.triggerIcon} />
          </button>
        </div>

        {isOpen && (
          <div className={styles.popover} ref={popoverRef}>
            <DayPicker
              mode="single"
              selected={
                value && typeof value === "string"
                  ? (() => {
                      const [a, m, d] = value.split("-").map(Number)
                      return new Date(a, m - 1, d)
                    })()
                  : value
              }
              onSelect={(d) => {
                if (!d) return
                onChange(d)
                setIsOpen(false)
              }}
              fromDate={new Date()}
              toDate={new Date(2026, 11, 31)}
              locale={ptBR}
              modifiersStyles={dayPickerModifiersStyles}
              styles={dayPickerStyles}
            />
          </div>
        )}
      </div>

      <div className={styles.horarioBloco}>
        <label className={styles.label}>HORÁRIO <span style={{ color: 'red' }}>*</span></label>
        <input
          className={`${styles.input} ${styles.inputHorario} ${horarioErro ? styles.inputErro : ""}`}
          type="time"
          min={HORARIO_MIN}
          max={HORARIO_MAX}
          value={horario}
          onChange={handleHorario}
          onBlur={handleHorarioBlur}
          style={{ color: horario ? 'var(--bg)' : 'rgba(245, 237, 224, 0.5)' }}
        />
        {horarioErro && (
          <span className={styles.erroMsg}>
            Horário disponível: 09:00 – 18:30
          </span>
        )}
      </div>
    </div>
  )
}