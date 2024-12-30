document.getElementById('userForm').addEventListener('submit', function(event) {
    event.preventDefault();

    // Obtiene los valores de los inputs del formulario
    const parentName = document.getElementById('parentName').value;
    const childName = document.getElementById('childName').value;
    const childAge = parseInt(document.getElementById('childAge').value);

    let stage;
    if (childAge <= 24) {
        stage = 'Bebé (0-24 meses)';
    } else if (childAge <= 144) {
        stage = 'Niño (2-12 años)';
    } else {
        stage = 'Adolescente (12-18 años)';
    }

    document.getElementById('options').style.display = 'block';
    document.getElementById('result').innerHTML = `<p>Hola ${parentName}, ${childName} está en la etapa de ${stage}.</p>`;

    // Guarda estos valores para enviarlos luego con las solicitudes de ayuda
    window.parentName = parentName;
    window.childName = childName;
    window.childAge = childAge;
});
function fetchAdvice(type) {
    const url = 'https://kmisanchez0604-github-io.onrender.com';

    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            type: type,
            age: window.childAge,
            parentName: window.parentName,
            childName: window.childName,
        })
    })
    .then(response => response.json())
    .then(data => {
        // Procesa la respuesta del servidor para hacerla más legible
        const serverResponse = data.data.Output;

        // Genera el HTML estructurado
        const formattedResponse = `
            <div class="response-container">
                <h2>Consejos para la Etapa de Desarrollo</h2>
                <p>${serverResponse}</p>
            </div>
        `;

        document.getElementById('result').innerHTML = formattedResponse;
    })
    .catch(error => {
        console.error('Error fetching advice:', error);
        document.getElementById('result').innerHTML = `<p>Ocurrió un error, intenta de nuevo.</p>`;
    });
}
