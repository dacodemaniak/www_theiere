/**
 * @name ToastModule
 * @desc Gestion des toasts (snackbar)
 * @author IDea Factory - Déc. 2018 (dev-team@ideafactory.fr)
 * @package modules/toast
 * @version 1.0.0
 */
export class ToastModule {
    private options: any;

    public constructor(options: any) {
        this.options = {
            position: options.position || 'top',
            duration: options.duration || 3,
            appear: options.appear || 'bounceInDown',
            disappear: options.disappear || 'bounceOutDown',
            type: options.type || 'success',
            height: options.height || 200,
            width: options.width || 300,
            message: options.message || '',
            title: options.title || '',
        };
    }

    public setTitle(title: string): ToastModule {
        this.options.title = title;
        return this;
    }

    public setMessage(message: string): ToastModule {
        this.options.message = message;

        return this;
    }

    public setType(type: string): ToastModule {
        this.options.type = type;

        return this;
    }

    public show() {
        const toast: JQuery = $('<div>');
        toast
            .addClass('toast')
            .addClass('animated')
            .addClass(this.options.appear)
            .addClass(this.options.position)
            .addClass(this.options.type)
            .attr('width', this.options.width)
            .attr('height', this.options.height)
            .html('<h5>' + this.options.title + '</h5>')
            .html('<blockquote>' + this.options.message + '</blockquote>')
        
        toast.appendTo($('body'));
        
        setTimeout(
            () => {
                toast
                    .removeClass(this.options.appear)
                    .addClass(this.options.disappear)
                setTimeout(
                    () => {
                        toast.remove()
                    },
                    1500
                );
            },
            this.options.duration * 1000
        );
        
    }


}