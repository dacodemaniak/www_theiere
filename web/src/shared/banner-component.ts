/**
 * @name BannerComponent
 * @desc Affichage de la bannière de conformité traceurs et RGPD
 * @author IDea Factory - Jan. 2019 (dev-team@ideafactory.fr)
 * @package shared/components
 * @version 1.0.0
 */
export class BannerComponent {
    private alreadyChecked: boolean = false;

    public constructor() {
        let eShopCookies: string;
        eShopCookies = sessionStorage.getItem('eshopCookies');

        console.log('cookie : ' + eShopCookies);

        if (eShopCookies) {
            console.log('Traite la valeur de sessionStorage ' + eShopCookies);
            if (eShopCookies === 'true') {
                console.warn('A priori, la valeur est vraie !!!');
                this.alreadyChecked = true;
            }
        }

        if (this.alreadyChecked) {
            console.info('Les cookies sont acceptés');
        } else {
            this._show();
            sessionStorage.setItem('eshopCookies', 'false');
        }
    }

    private _show(): void {
        const banner: JQuery = $('<div>');
        banner
            .attr('id', 'banner-rgpd')
            .addClass('banner-outer');
        
        const inner: JQuery = $('<div>');
        inner
            .addClass('banner-inner')
            .addClass('row');

        const content: JQuery = $('<p>');
        content
            .addClass('banner-content')
            .addClass('col-xl-10')
            .addClass('col-lg-10')
            .addClass('col-md-10')
            .addClass('col-sm-12')
            .addClass('col-12')
            .html('Ce site utilise des cookies pour améliorer votre confort de navigation et vous proposer des contenus adaptés.');

        const button: JQuery = $('<button>');
        button
            .attr('id', 'dismiss-btn')
            .attr('data-rel', 'banner-rgpd')
            .addClass('col-xl-2')
            .addClass('col-lg-2')
            .addClass('col-md-2')
            .addClass('col-sm-12')
            .addClass('col-12')
            .addClass('btn')
            .addClass('btn-primary')
            .html('Continuer');
        
        content.appendTo(inner);
        button.appendTo(inner);
        inner.appendTo(banner);

        banner.appendTo($('body'));

        this._dismiss(banner);
    }

    private _dismiss(banner: JQuery): void {
        $('body').on(
            'click',
            '#dismiss-btn',
            (event: any): void => {
                console.log('Click sur le bouton détecté');
                const button: JQuery = $(event.target);
                const bannerId: string = button.attr('data-rel');
                const banner: JQuery = $('#' + bannerId);
                banner.remove();
                sessionStorage.setItem('eshopCookies', 'true');
            }
        );
    }
}