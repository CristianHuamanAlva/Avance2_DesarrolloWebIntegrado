import React, { useEffect } from 'react';

function Reserva() {
  useEffect(() => {
    const $ = window.$;

    // Inicializar datetimepicker para la fecha
    $('#date').datetimepicker({
      format: 'L',
    });

    // Inicializar datetimepicker para la hora
    $('#time').datetimepicker({
      format: 'LT',
    });
  }, []);

  const isHome = window.location.pathname === '/';
  const containerClass = isHome
    ? 'container-fluid bg-light'
    : 'container-fluid bg-light mt-5';

  const reservaHTML = `
    <!-- vistas/reserva.html -->
    <!-- Inicio de Reservas -->
    <div class="${containerClass}">
      <div class="container">
        <div class="row align-items-center">
          <div class="col-lg-5">
            <div class="bg-primary py-5 px-4 px-sm-5">
              <form class="py-5">
                <div class="form-group">
                  <input type="text" class="form-control border-0 p-4" placeholder="Tu Nombre" required="required" />
                </div>
                <div class="form-group">
                  <input type="email" class="form-control border-0 p-4" placeholder="Tu Correo Electrónico" required="required" />
                </div>
                <div class="form-group">
                  <div class="date" id="date" data-target-input="nearest">
                    <input type="text" class="form-control border-0 p-4 datetimepicker-input" placeholder="Fecha de Reserva" data-target="#date" data-toggle="datetimepicker"/>
                  </div>
                </div>
                <div class="form-group">
                  <div class="time" id="time" data-target-input="nearest">
                    <input type="text" class="form-control border-0 p-4 datetimepicker-input" placeholder="Hora de Reserva" data-target="#time" data-toggle="datetimepicker"/>
                  </div>
                </div>
                <div class="form-group">
                  <select class="custom-select border-0 px-4" style="height: 47px;">
                    <option selected>Selecciona un Servicio</option>
                    <option value="1">Hospedaje para Mascotas</option>
                    <option value="2">Alimentación</option>
                    <option value="3">Aseo y Cuidado</option>
                  </select>
                </div>
                <div>
                  <button class="btn btn-dark btn-block border-0 py-3" type="submit">Reservar Ahora</button>
                </div>
              </form>
            </div>
          </div>
          <div class="col-lg-7 py-5 py-lg-0 px-3 px-lg-5">
            <h4 class="text-secondary mb-3">¿Te vas de vacaciones?</h4>
            <h1 class="display-4 mb-4">Reserva para <span class="text-primary">tu Mascota</span></h1>
            <p>Nos encargamos del bienestar de tu mascota mientras tú descansas. ¡Déjala en buenas manos!</p>
            <div class="row py-2">
              <div class="col-sm-6">
                <div class="d-flex flex-column">
                  <div class="d-flex align-items-center mb-2">
                    <h1 class="flaticon-house font-weight-normal text-secondary m-0 mr-3"></h1>
                    <h5 class="text-truncate m-0">Hospedaje para Mascotas</h5>
                  </div>
                  <p>Tu mascota estará cómoda, segura y acompañada todo el tiempo.</p>
                </div>
              </div>
              <div class="col-sm-6">
                <div class="d-flex flex-column">
                  <div class="d-flex align-items-center mb-2">
                    <h1 class="flaticon-food font-weight-normal text-secondary m-0 mr-3"></h1>
                    <h5 class="text-truncate m-0">Alimentación</h5>
                  </div>
                  <p>Ofrecemos una dieta equilibrada adaptada a las necesidades de tu mascota.</p>
                </div>
              </div>
              <div class="col-sm-6">
                <div class="d-flex flex-column">
                  <div class="d-flex align-items-center mb-2">
                    <h1 class="flaticon-grooming font-weight-normal text-secondary m-0 mr-3"></h1>
                    <h5 class="text-truncate m-0">Aseo y Cuidado</h5>
                  </div>
                  <p class="m-0">Baños, cepillado y cuidados especiales para que luzca y se sienta genial.</p>
                </div>
              </div>
              <div class="col-sm-6">
                <div class="d-flex flex-column">
                  <div class="d-flex align-items-center mb-2">
                    <h1 class="flaticon-toy font-weight-normal text-secondary m-0 mr-3"></h1>
                    <h5 class="text-truncate m-0">Entrenamiento Básico</h5>
                  </div>
                  <p class="m-0">Sesiones de juego y aprendizaje para mejorar su comportamiento.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- Fin de Reservas -->
  `;

  return <div dangerouslySetInnerHTML={{ __html: reservaHTML }} />;
}

export default Reserva;
