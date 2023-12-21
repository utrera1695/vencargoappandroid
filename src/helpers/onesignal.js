import { uid } from 'quasar'

// funcion para generar un uid para el dispositivo
const generateDispositiveUid = () => {
  const dispositiveUid = uid()
  localStorage.setItem('dispositiveUid', dispositiveUid)
  return dispositiveUid
}

// funcion para obtener el uid del dispositivo
const getDispositiveUid = () => {
  const dispositiveUid = localStorage.getItem('dispositiveUid')
  return dispositiveUid
}

export default {
  generateDispositiveUid,
  getDispositiveUid
}
