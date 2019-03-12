/**
 * @name SmoothRemoveHelper
 */
export class SmoothRemoveHelper {
    public static remove(element: JQuery): void {
        element
            .addClass('animated')
            .addClass('fadeOut');
        setTimeout(
            () => element.remove(),
            1500
        );
    }
}