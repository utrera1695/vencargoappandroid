
const routes = [
  {
    path: '/index',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        component: () => import('pages/Index.vue'),
        meta: { toolbar: true, footer: true }
      },
      {
        path: '/prealertas/form',
        component: () => import('pages/prealertas/Form.vue'),
        meta: { toolbar: false, toolbarRoute: true, title: 'Añadir Pre-Alerta', backroute: '/prealertas', footer: false }
      },
      {
        path: '/prealertas/form/:id',
        component: () => import('pages/prealertas/Form.vue'),
        meta: { toolbar: false, toolbarRoute: true, title: 'Pre-Alerta', backroute: '/prealertas', footer: false }
      },
      {
        path: '/prealertas',
        component: () => import('pages/prealertas/List.vue'),
        meta: { toolbar: false, toolbarRoute: true, title: 'Mis Pre-Alertas', backroute: '/index', footer: false, addButton: true }
      },
      {
        path: '/paqueteria',
        component: () => import('pages/paqueteria/List.vue'),
        meta: { toolbar: false, footer: false, toolbarRoute: true, title: 'Almacén', backroute: '/index' }
      },
      {
        path: '/paqueteria/form/:id',
        component: () => import('pages/paqueteria/Form.vue'),
        meta: { toolbar: false, footer: false, toolbarRoute: true, title: 'Mi Paquete', backroute: '/paqueteria' }
      },
      {
        path: '/procesado',
        component: () => import('pages/Procesado.vue'),
        meta: { toolbar: false, footer: false }
      },
      {
        path: '/instrucciones',
        component: () => import('pages/instrucciones/List.vue'),
        meta: { toolbar: false, footer: false, toolbarRoute: true, title: 'Instrucciones', backroute: '/index' }
      },
      {
        path: '/instrucciones/form/:paquete_id',
        component: () => import('pages/instrucciones/Form.vue'),
        meta: { toolbar: false, footer: false, toolbarRoute: true, title: 'Instrucciones', backroute: '/index' }
      },
      {
        path: '/instrucciones/form',
        component: () => import('pages/instrucciones/Form.vue'),
        meta: { toolbar: false, footer: false, toolbarRoute: true, title: 'Instrucciones', backroute: '/index' }
      },
      {
        path: '/instrucciones/form/paquete/:crear_id',
        component: () => import('pages/instrucciones/Form.vue'),
        meta: { toolbar: false, footer: false, toolbarRoute: true, title: 'Instrucciones', backroute: '/index' }
      },
      {
        path: '/envios',
        component: () => import('pages/envios/List.vue'),
        meta: { toolbar: false, toolbarRoute: true, title: 'Mis Envíos', backroute: '/index', footer: false, addButton: false }
      },
      {
        path: '/facturas',
        component: () => import('pages/facturas/List.vue'),
        meta: { toolbar: false, toolbarRoute: true, title: 'Mis Facturas', backroute: '/index', footer: false, addButton: false }
      },
      {
        path: '/perfil',
        component: () => import('pages/perfil/Perfil.vue'),
        meta: { toolbar: false, toolbarRoute: true, title: 'Mi Perfil', backroute: '/index', footer: false, addButton: false }
      },
      {
        path: '/perfil/datos_personales',
        component: () => import('pages/perfil/DatosP.vue'),
        meta: { toolbar: false, toolbarRoute: true, title: 'Mi Perfil', backroute: '/index', footer: false, addButton: false }
      },
      {
        path: '/perfil/cambiar_pass',
        component: () => import('pages/perfil/Password.vue'),
        meta: { toolbar: false, toolbarRoute: true, title: 'Mi Perfil', backroute: '/index', footer: false, addButton: false }
      },
      {
        path: '/calculadora',
        component: () => import('pages/calculadora/Form.vue'),
        meta: { toolbar: false, toolbarRoute: true, title: 'Calculadora', backroute: '/index', footer: false, addButton: false }
      },
      {
        path: '/contacto',
        component: () => import('pages/contacto/Form.vue'),
        meta: { toolbar: false, toolbarRoute: true, title: 'Contacto', backroute: '/index', footer: false, addButton: false }
      },
      // reportar pago
      {
        path: '/reportar_pago',
        component: () => import('pages/reportar_pago/List.vue'),
        meta: { toolbar: false, toolbarRoute: true, title: 'Reportar Pago', backroute: '/index', footer: false, addButton: false }
      },
      {
        path: '/reportar_pago/form/:id',
        component: () => import('pages/reportar_pago/Form.vue'),
        meta: { toolbar: false, toolbarRoute: true, title: 'Reportar Pago', backroute: '/reportar_pago', footer: false, addButton: false }
      }
    ]
  },
  {
    path: '/registro',
    component: () => import('pages/Registro.vue')
  },
  {
    path: '/login',
    component: () => import('pages/Login.vue')
  },
  {
    path: '/forgot_password',
    component: () => import('pages/ForgotPassword.vue')
  },
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '*',
    redirect: '/login'
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '*',
    component: () => import('pages/Error404.vue')
  }
]

export default routes
