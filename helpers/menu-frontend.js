const getMenuFrontEnd = (role = 'USER_ROLE') => {
    const menu = [
        {
            titulo: 'Principal',
            icono: 'mdi mdi-database',
            submenu: [
            { titulo: 'Dashboard', url: '/'},
            { titulo: 'Progress Bar', url: '/dashboard/progress'},
            { titulo: 'Gráficas', url: '/dashboard/grafica1'},
            { titulo: 'Rxjs', url: '/dashboard/rxjs'},
            { titulo: 'Promesas', url: '/dashboard/promesas' }
            ]
        },
        {
            titulo: 'Mantenimientos',
            icono: 'mdi mdi-folder-lock-open',
            submenu: [
            //{ titulo: 'Usuarios', url: 'usuarios'},
            { titulo: 'Hospitales', url: 'hospitales'},
            { titulo: 'Médicos', url: 'medicos'},
            ]
        }
    ];

    if(role === 'ADMIN_ROLE'){
        menu[1].submenu.unshift({ titulo: 'Usuarios', url: 'usuarios'});
    }

    return menu;
}

module.exports = {
    getMenuFrontEnd
}