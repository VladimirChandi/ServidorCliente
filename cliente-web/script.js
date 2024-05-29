document.addEventListener('DOMContentLoaded', function() {
  const resultadosDiv = document.getElementById('resultados');
  const btnMostrarGanador = document.getElementById('btnMostrarGanador');
  const btnVerParticipantes = document.getElementById('btnVerParticipantes');

  // Función para realizar una solicitud GET a la ruta /corredores/ganador
  function obtenerGanador() {
    fetch('http://localhost:3000/corredores/ganador')
      .then(response => {
        if (!response.ok) {
          throw new Error('No se pudo obtener el ganador');
        }
        return response.json();
      })
      .then(data => {
        // Calcular la distancia recorrida con las iniciales "Km"
        const distanciaRecorrida = `${data.ganador.distanciaRecorrida} Km`;
      
        // Mostrar el resultado en la página
        resultadosDiv.innerHTML = `
          <h2>Ganador de la Carrera</h2>
          <p>Corredor: ${data.ganador.corredor}</p>
          <p>Tiempo: ${data.ganador.tiempo}</p>
          <p>Distancia Recorrida: ${distanciaRecorrida}</p>
          <p>Pausas: ${data.ganador.pausas}</p>
        `;
        resultadosDiv.style.display = 'block';
      })
      
      .catch(error => {
        console.error('Error:', error);
      });
  }

  // Función para alternar la visibilidad del resultado del ganador
  function toggleGanador() {
    if (resultadosDiv.style.display === 'none' || resultadosDiv.innerHTML === '') {
      obtenerGanador();
    } else {
      resultadosDiv.style.display = 'none';
      resultadosDiv.innerHTML = '';  // Opcional: Limpia el contenido
    }
  }

  // Ocultar el div de resultados al inicio
  resultadosDiv.style.display = 'none';

  // Agregar un evento de clic al botón para mostrar/ocultar el ganador
  btnMostrarGanador.addEventListener('click', toggleGanador);

  // Función para realizar una solicitud POST para agregar un nuevo corredor
  function agregarCorredor(event) {
    event.preventDefault();
    const nombre = document.getElementById('nombre').value;
    const velocidad = document.getElementById('velocidad').value;

    fetch('http://localhost:3000/corredores', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ nombre, velocidad })
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('No se pudo agregar el corredor');
        }
        return response.json();
      })
      .then(data => {
        alert('Corredor agregado exitosamente');
        document.getElementById('nuevoCorredorForm').reset();
      })
      .catch(error => {
        console.error('Error:', error);
      });
  }

  // Agregar un evento de submit al formulario para agregar un nuevo corredor
  const nuevoCorredorForm = document.getElementById('nuevoCorredorForm');
  nuevoCorredorForm.addEventListener('submit', agregarCorredor);

  // Función para obtener y mostrar los participantes
  function verParticipantes() {
    if (resultadosDiv.style.display === 'none' || resultadosDiv.innerHTML === '') {
      fetch('http://localhost:3000/corredores')
        .then(response => {
          if (!response.ok) {
            throw new Error('No se pudo obtener los participantes');
          }
          return response.json();
        })
        .then(data => {
          // Crear un contenedor para los participantes
          resultadosDiv.innerHTML = '<h2>Participantes</h2>';
          const participantesDiv = document.createElement('div');
          participantesDiv.classList.add('participantes');

          // Añadir los participantes al contenedor
          data.forEach(corredor => {
            const participanteDiv = document.createElement('div');
            participanteDiv.classList.add('participante');
            participanteDiv.innerHTML = `
              <p><strong>Nombre:</strong> ${corredor.nombre}</p>
              <p><strong>Velocidad:</strong> ${corredor.velocidad} km/h</p>
            `;
            participantesDiv.appendChild(participanteDiv);
          });

          // Añadir el contenedor de participantes al div de resultados
          resultadosDiv.appendChild(participantesDiv);
          resultadosDiv.style.display = 'block';
        })
        .catch(error => {
          console.error('Error:', error);
        });
    } else {
      resultadosDiv.style.display = 'none';
      resultadosDiv.innerHTML = '';  // Opcional: Limpia el contenido
    }
  }

  // Agregar un evento de clic al botón para ver participantes
  btnVerParticipantes.addEventListener('click', verParticipantes);
});





