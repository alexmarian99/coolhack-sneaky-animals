function initMetronic() {
    KTLayoutHeader.init('kt_header', 'kt_header_mobile');
    KTLayoutHeaderMenu.init('kt_header_menu', 'kt_header_menu_wrapper');
    KTLayoutHeaderTopbar.init('kt_header_mobile_topbar_toggle');
    KTLayoutAside.init('kt_aside');
    KTLayoutAsideMenu.init('kt_aside_menu');
    KTLayoutSubheader.init('kt_subheader');
    KTLayoutContent.init('kt_content');
    KTLayoutFooter.init('kt_footer');
    KTLayoutScrolltop.init('kt_scrolltop');
    KTLayoutStickyCard.init('kt_page_sticky_card');
    KTLayoutStretchedCard.init('kt_page_stretched_card');
    KTLayoutExamples.init();
    KTLayoutDemoPanel.init('kt_demo_panel');
    KTLayoutChat.init('kt_chat_modal');
    KTLayoutQuickActions.init('kt_quick_actions');
    KTLayoutQuickNotifications.init('kt_quick_notifications');
    KTLayoutQuickPanel.init('kt_quick_panel');
    KTLayoutQuickSearch.init('kt_quick_search');
    KTLayoutQuickUser.init('kt_quick_user');
    KTLayoutSearchInline().init('kt_quick_search_inline');
    KTLayoutSearch().init('kt_quick_search_dropdown');
}

function showLogInForm(form) {
    var cls = 'login-' + form + '-on';
    var form = 'kt_login_' + form + '_form';

    $('#kt_login').removeClass('login-forgot-on');
    $('#kt_login').removeClass('login-signin-on');
    $('#kt_login').removeClass('login-signup-on');

    $('#kt_login').addClass(cls);

    KTUtil.animateClass(KTUtil.getById(form), 'animate__animated animate__backInUp');
}