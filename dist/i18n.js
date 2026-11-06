export const locale = document.documentElement.lang === 'en' ? 'en-GB' : 'es-ES';
const messages = {
  'Elige una especialidad o desliza para descubrir': 'Choose a speciality or swipe to explore',
  'Especialidad anterior': 'Previous speciality',
  'Especialidad siguiente': 'Next speciality',
  'Activar animaciones': 'Enable animations',
  'Pausar animaciones': 'Pause animations',
  'Abrir menú': 'Open menu',
  'Cerrar menú': 'Close menu',
  ' platos disponibles': ' dishes available',
  'No encontramos ese plato. Prueba otro nombre o categoría.': 'We could not find that dish. Try another name or category.',
  'Hoy cerrado': 'Closed today',
  'Abierto · hasta las 16:30': 'Open · until 16:30',
  'Abierto · hasta las 00:00': 'Open · until midnight',
  'Hoy abrimos a las 13:00': 'Today we open at 13:00',
  'Hoy abrimos a las 13:30': 'Today we open at 13:30',
  'Hoy abrimos a las 20:00': 'Today we open at 20:00',
  'Elige una fecha en el calendario.': 'Choose a date in the calendar.',
  'Vista previa completada. No se ha enviado ninguna solicitud ni realizado ninguna reserva.': 'Preview complete. No request has been sent and no reservation has been made.'
};
export const t = text => locale === 'en-GB' ? (messages[text] || text) : text;
document.querySelectorAll('.language-switch a').forEach(link => {
  link.addEventListener('click', () => { link.hash = location.hash; });
});
