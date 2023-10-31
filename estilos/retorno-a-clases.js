$(document).ready(function ($) {
  $('#p-departamento').select2()

  $("#frm-encuesta").on('submit', function () {
    cursosSeleccionados.forEach((c, k) => { cursosSeleccionados[k].seccion = c.seccion.padEnd(2) });
    $('#p-cursos').val(JSON.stringify({ cursos: cursosSeleccionados }))
  })

  $('select[name=p-carrera]').change(() => {
    let creditos = $('#p-carrera').val().split('-')[1]
    $('input[name=p-creditos]').prop('checked', false)
    let id = creditos < 50 ? 1 : (creditos <= 100 ? 2 : (creditos <= 150 ? 3 : (creditos <= 200 ? 4 : (creditos <= 250 ? 5 : 6))))
    $(`#p-creditos-${id}`).prop('checked', true)
  })

  $('input[name=p-trabaja]').change(() => {
    if ($('#p-trabaja-1').is(':checked')) {
      $('#div-modalidad-trabajo').empty().append(`
        <br>Modalidad de trabajo:<br>
        ${generarInputRadio('modalidad-trabajo', 1, 4, 'Presencial')}
        ${generarInputRadio('modalidad-trabajo', 2, 33, 'Híbrida')}
        ${generarInputRadio('modalidad-trabajo', 3, 5, 'Virtual')}
      `)
    } else {
      $('#div-modalidad-trabajo').empty()
    }
  })

  $('input[name=p-cursos-semestre]').change(() => {
    if ($('#p-cursos-semestre-1').is(':checked')) {
      $('#div-manual').empty().append(`
        <div class="card">
          <div class="card-body">
            <h5>1. ¿Conoce el Normativo para la educación a distancia, híbrida o presencial?</h5><br>
            <div class="form-check form-check-inline">
              <input class="form-check-input" type="radio" name="p-manual" id="p-manual-1" value="1" required>
              <label class="form-check-label" for="p-manual-1">Si</label>
            </div> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <div class="form-check form-check-inline">
              <input class="form-check-input" type="radio" name="p-manual" id="p-manual-2" value="0" required>
              <label class="form-check-label" for="p-manual-2">No</label>
            </div>
          </div>
        </div>
      `)

      $('input[name=p-manual]').change(()=>{
        preguntaNormativo()
        $('#p-listado-cursos').select2()
      })

    } else {
      $('#div-manual').empty().append(`
        <input type="submit" id='btn-confirmar' value="Enviar" class="btn btn-primary">
      `)
      $('#div-preguntas').empty()
    }
  })

})

$(document).on('change', '.chck-curso', function () {
  let curso = $(this).val().split('%')
  cursosSeleccionados = cursosSeleccionados.filter(e => !!!(e.curso == curso[1] && e.tipo_seccion == curso[0]))
  cursosSeleccionados.push({ curso: curso[1], seccion: curso[2], tipo_seccion: curso[0] })
});

const preguntaNormativo = () =>{
  cursosSeleccionados = []
  cursos_mostrados = []
  if ($('#p-manual-1').is(':checked')) {
    $('#div-preguntas').empty().append(`
      <div class="card">
        <div class="card-body">
          <h5>2. ¿Cómo desearía recibir los cursos que estima se asignará durante el primer semestre de 2024? (puede elegir varias opciones)</h5>
          <div class="custom-control custom-checkbox">
            <input type="checkbox" class="custom-control-input" id="p-modalidad-v" name="p-modalidad-v" value="2" required>
            <label class="custom-control-label" for="p-modalidad-v">
              Modalidad virtual (Todas las actividades son en línea, soporte de UEDI)
            </label>
          </div>
          <div class="custom-control custom-checkbox">
            <input type="checkbox" class="custom-control-input" id="p-modalidad-p" name="p-modalidad-p" value="2" required>
            <label class="custom-control-label" for="p-modalidad-p">
              Modalidad presencial (Todas las actividades presenciales, tareas y control de notas en UEDI)
            </label>
          </div>
          <div class="custom-control custom-checkbox">
            <input type="checkbox" class="custom-control-input" id="p-modalidad-h" name="p-modalidad-h" value="3" required>
            <label class="custom-control-label" for="p-modalidad-h">
              Modalidad híbrida (Clases teóricas virtuales, laboratorios, prácticas presenciales; tareas y control de notas en UEDI)
            </label>
          </div>
        </div>
      </div>
      <div class="card">
        <div class="card-body">
          <h5>
            3. ¿De acuerdo con el grado de avance en su carrera qué cursos y en qué horario le interesaría asignarse durante el primer semestre de 2024?
          </h5>
          ${preguntaCursos()}
        </div>
      </div>
      <div id="div-movilidad"></div>
      <div id="div-horario"></div>
      <div class="card">
        <div class="card-body">
          <h5>6. Seleccione las tres principales razones por las que eligió la modalidad de estudios para recibir los cursos:<h5>
          ${preguntaRazon()}
        </div>
      </div>
      <input type="submit" id='btn-confirmar' value="Enviar" class="btn btn-primary">
    `)

    $('#p-modalidad-v').change(() => {
      verificarObligacionModalidad()
    })

    $('#p-modalidad-p').change(() => {
      verificarObligacionModalidad()
      if ($('#p-modalidad-p').is(':checked') && !!!existeMovilidad) {
        preguntaMovilidad()
        preguntaHorario()
        existeMovilidad = true
      } else {
        if (!!!$('#p-modalidad-h').is(':checked')) {
          $('#div-movilidad').empty()
          $('#div-horario').empty()
          existeMovilidad = false
        }
      }
    })

    $('#p-modalidad-h').change(() => {
      verificarObligacionModalidad()
      if ($('#p-modalidad-h').is(':checked') && !!!existeMovilidad) {
        preguntaMovilidad()
        preguntaHorario()
        existeMovilidad = true
      } else {
        if (!!!$('#p-modalidad-p').is(':checked')) {
          $('#div-movilidad').empty()
          $('#div-horario').empty()
          existeMovilidad = false
        }
      }
    })

    $('.razon').on('change', () => {
      verificarObligacionMotivo()
    })
    
  } else {
    $('#div-preguntas').empty().append(`
      <div class="card">
        <div class="card-body">
          Leer el manual
        </div>
      </div>
    `)
  }
}

const preguntaCursos = () => {
  let options = ''
  CURSOS.forEach((e) => {
    options = `${options}<option value='${JSON.stringify(e)}'>${e.codigo} ${e.nombre_curso}</option>`
  });
  return `
    <div class="form-group row">
      <div class="col-6">
        <select id="p-listado-cursos" name="p-listado-cursos" class="form-control">${options}</select>
      </div>
      <div class="col-6 text-center">
        <button type="button" class="btn btn-primary mb-2" onclick="agregarCurso()">Agregar</button>
      </div>
    </div>
    <div id="div-cursos"></div>
  `
}

function agregarCurso() {
  let curso = JSON.parse($('#p-listado-cursos option:selected').val())
  if (!!!(cursos_mostrados.find((e) => e === curso.codigo))) {
    let configuraciones = []
    curso.configuracion_labs.forEach(conf =>{
      if(conf.tipo!=1 && conf.tipo_docente == 0){
        configuraciones.push(conf)
      }
    })
    cursos_mostrados.push(curso.codigo)
    let laboratorio = ''
    if (curso.seccion_laboratorio && curso.seccion_laboratorio.length > 0) {
      curso.seccion_laboratorio.forEach( lab => {
        laboratorio = `${laboratorio}
            <h6>${lab.nombreTipo}</h6>
            ${generarTabla(lab, true, configuraciones)}
          `
      })
    }
    $('#div-cursos').prepend(`
      <div class="card bg-light" id="${curso.codigo}">
        <div class="card-header">
          <div class="form-group row">
            <h4 class="col-sm-6">${curso.codigo} ${curso.nombre_curso}</h4>
            <div class="col-sm-6">
              <button type="button" class="close btn btn-outline-danger" onclick="quitarCurso('${curso.codigo}')">
                <i class="mdi mdi-24px mdi-close-box "></i>
              </button>
            </div>
          </div>
        </div>
        <div class="card-body">
          <h6>CLASE MAGISTRAL</h6>
          ${generarTabla(curso, false, configuraciones)}
          ${laboratorio}
        </div>
      </div>
    `)
  }
}

function quitarCurso(curso) {
  cursosSeleccionados = cursosSeleccionados.filter((v) => !!!(v.curso == curso))
  cursos_mostrados = cursos_mostrados.filter(c => c != curso)
  $(`#${curso}`).remove()
}

const generarTabla = (curso, esLab, conf) => {
  let addModalidad = !!!(esLab && conf.length > 0)
  filas = '';
  let modalidades = ''
  if(!!!esLab && conf.length > 0){
    modalidades = generarEncabezadoModalidad(conf)
  }
  curso.secciones.forEach(seccion => {
    filas = `${filas} ${generarFila(curso.codigo, seccion, curso.tipo, addModalidad, conf)}`
  });
  return `
    <table class="table table-bordered">
      <thead>
        <tr>
          <th scope="col">Profesor</th>
          <th scope="col">Sección</th>
          <th scope="col">Inicio</th>
          <th scope="col">Fin</th>
          <th scope="col">Días</th>
          ${addModalidad?'<th scope="col">Modalidad</th>':''}
          ${modalidades}
          <th scope="col">Marcar</th>
        </tr>
      </thead>
      <tbody>${filas}</tbody>
    </table>
  `
}

const generarEncabezadoModalidad = (clases) => {
  let encabezados = ''
  clases.forEach((c)=>{
    encabezados = `${encabezados}
      <th scope="col">Modalidad ${c.nombre}</th>
    `
  })
  return encabezados
}

const generarFilaModalidad = (clases, rowspan) => {
  let filas = ''
  clases.forEach((c)=>{
    filas = `${filas}
      <td ${rowspan}>${c.modalidad}</td>
    `
  })
  return filas
}

const generarFila = (codCurso, seccion, tipo, addModalidad, clases) => {
  console.log(tipo);
  console.log(clases);
  console.log(seccion);
  console.log(addModalidad);
  if(tipo == 1 && clases.length > 0){
    clases.forEach( (c, k) => {
      switch (c.tipo) {
        case 2: clases[k].modalidad = seccion.mod_lab; break;
        case 3: clases[k].modalidad = seccion.mod_trabajo; break;
        case 5: clases[k].modalidad = seccion.mod_practica; break;
        default: clases[k].modalidad = seccion.modalidad; break;
      }
    });
  }
  let horarios = seccion.horarios;
  let rowspan = horarios.length > 1 ? `rowspan="${horarios.length}"` : '';
  let celdas = '';
  if (horarios.length > 1) {
    horarios.forEach((h, k) => {
      if (k > 0) celdas = `${celdas} ${generarCelda(h)}`
    });
  }
  let secc = seccion.seccion.trim()
  let filasModalidad = ''
  if(tipo == 1 && clases.length > 0){
    filasModalidad = generarFilaModalidad(clases, rowspan)
  }
  
  return `
    <tr>
      <td ${rowspan}>${seccion.nombre_docente}</td>
      <td ${rowspan}>${seccion.seccion}</td>
      <td>${horarios[0].horainicio}</td>
      <td>${horarios[0].horafinal}</td>
      <td>${convertirDias(horarios[0].dias)}</td>
      ${ addModalidad ? `<td ${rowspan}>${seccion.modalidad}</td>` : ''}
      ${ filasModalidad }
      <td ${rowspan} class="align-items-center">
        <div class="custom-control custom-radio text-center">
          <input 
            class="form-check-input position-static chck-curso ${tipo}-${codCurso}"
            type="radio"
            name="${tipo}-${codCurso}"
            id="${tipo}-${codCurso}-${secc.substring(1, 2) == '+' ? secc.substring(0, 1) + '4' : secc}"
            value="${tipo}%${codCurso}%${secc}"
            aria-label="..."
            required
          >
        </div>
      </td>
    </tr>
    ${celdas}
  `
}

const generarCelda = (horario) => {
  return `
    <tr>
      <td>${horario.horainicio}</td>
      <td>${horario.horafinal}</td>
      <td>${convertirDias(horario.dias)}</td>
    </tr>
  `
}

const convertirDias = (dias) => {
  let c = [];
  if (dias.substring(0, 1) == 'X') { c.push('L') }
  if (dias.substring(1, 2) == 'X') { c.push('MA') }
  if (dias.substring(2, 3) == 'X') { c.push('MI') }
  if (dias.substring(3, 4) == 'X') { c.push('J') }
  if (dias.substring(4, 5) == 'X') { c.push('V') }
  if (dias.substring(5, 6) == 'X') { c.push('S') }
  if (dias.substring(6, 7) == 'X') { c.push('D') }
  return c.join('-')
}

const verificarObligacionMotivo = () => {
  let validos = 0;
  for (let i = 0; i < 10; i++) {
    if ($(`#p-6-${i}`).is(':checked')) {
      validos++;
    }
    if (validos >= 3) {
      for (let j = 0; j < 10; j++) {
        if (!!!$(`#p-6-${j}`).is(':checked')) {
          $(`#p-6-${j}`).prop('disabled', true)
        }
      }
      break;
    } else {
      $('.razon').prop('disabled', false)
    }
  }

}

const verificarObligacionModalidad = () => {
  if ($('#p-modalidad-v').is(':checked') || $('#p-modalidad-p').is(':checked') || $('#p-modalidad-h').is(':checked')) {
    $('#p-modalidad-v').prop('required', false)
    $('#p-modalidad-p').prop('required', false)
    $('#p-modalidad-h').prop('required', false)
  } else {
    $('#p-modalidad-v').prop('required', true)
    $('#p-modalidad-p').prop('required', true)
    $('#p-modalidad-h').prop('required', true)
  }
}

const preguntaMovilidad = () => {
  let checks = '';
  let arreglo = ['Automóvil', 'Motocicleta', 'Uber', 'Taxi', 'Transmetro', 'Transurbano', 'Caminata', 'Bicicleta'];
  arreglo.forEach((e, k) => {
    checks = `${checks} ${generarInputRadio('movilidad', k, k + 9, e)}`
  });
  $('#div-movilidad').empty().append(`
    <div class="card">
      <div class="card-body">
        <h5>4. Si elige la modalidad presencial o híbrida, ¿cómo se movilizará para ingresar a la USAC?</h5>
        ${checks}
      </div>
    </div>
  `)
}

const preguntaHorario = () => {
  $('#div-horario').empty().append(`
    <div class="card">
      <div class="card-body">
        <h5>
          5. Indique en cada jornada la cantidad de horas (valor numérico) que estima permanecería parqueado si 
          opta por la modalidad presencial o híbrida en sus actividades académicas en la Facultad de Ingeniería. 
          Si no usa el paqueo en alguna jornada dejar en blanco.
        </h5>
        <div class="form-group row">
          <label for="p-horas-matutina" class="col-sm-3 col-form-label">Matutina (7:00 a 12:00 horas)</label>
          <div class="col-sm-2">
            <input type="number" class="form-control" id="p-horas-matutina" name="p-hora-matutina" min="1" max="5">
            <div class="invalid-feedback">Valor entre 1 y 5</div>
          </div>
        </div>
        <div class="form-group row">
          <label for="p-horas-vespertina" class="col-sm-3 col-form-label">Vespertina (12:00 a 17:00 horas)</label>
          <div class="col-sm-2">
            <input type="number" class="form-control" id="p-horas-vespertina" name="p-hora-vespertina" min="1" max="5">
            <div class="invalid-feedback">Valor entre 1 y 5</div>
          </div>
        </div>
        <div class="form-group row">
          <label for="p-horas-nocturna" class="col-sm-3 col-form-label">Nocturna (17:00 a 21:00 hroas)</label>
          <div class="col-sm-2">
            <input type="number" class="form-control" id="p-horas-nocturna" name="p-hora-nocturna" min="1" max="4">
            <div class="invalid-feedback">Valor entre 1 y 4</div>
          </div>
        </div>
      </div>
    </div>
  `)
}

const preguntaRazon = () => {
  let checks = '';
  let arreglo = ['Participación en clase', 'Interacción con los compañeros', 'Posibilidad de trabajar y estudiar',
    'Optimización del tiempo', 'Aprovechamiento de la tecnología', 'Mayor interacción con los profesores',
    'Mejor calidad de la información', 'Se evitan congestiones de tráfico', 'Acceso desde lugares distantes', 'Laboratorios y prácticas'
  ];
  arreglo.forEach((e, k) => {
    checks = `${checks} ${generarCheckBox('6', k, k + 23, e, 'razon', true)}`
  });
  return checks
}

const generarCheckBox = (pregunta, id, valor, descripcion, clase, obligatorio) => {
  return `
    <div class="custom-control custom-checkbox">
      <input type="checkbox" class="custom-control-input ${clase ? clase : ''}" name="p-${pregunta}-${id}" id="p-${pregunta}-${id}" value="${valor}" ${obligatorio ? 'required' : ''}>
      <label class="custom-control-label" for="p-${pregunta}-${id}">
        ${descripcion}
      </label>
    </div>
  `
}

const generarInputRadio = (pregunta, id, valor, descripcion) => {
  return `
    <div class="custom-control custom-radio">
      <input type="radio" class="custom-control-input" id="p-${pregunta}-${id}" name="p-${pregunta}" value="${valor}" required>
      <label class="custom-control-label" for="p-${pregunta}-${id}">${descripcion}</label>
    </div>
  `
}