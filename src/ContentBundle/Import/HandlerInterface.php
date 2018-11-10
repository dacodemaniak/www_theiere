<?php
/**
* @name HandlerInterface Définition des Handlers d'importation
* @author IDea Factory (dev-team@ideafactory.fr) - Oct. 2018
* @package ContentBundle\Controller\Import
* @version 1.0.0
*/
namespace ContentBundle\Import;


interface HandlerInterface {
	/**
	 * Gestionnaire proprement dit
	 * @param array $data
	 */
	public function handle(array $data);
	
	/**
	 * Définit le gestionnaire suivant
	 * @param HandlerInterface $handler
	 */
	public function setNext(HandlerInterface $handler);
}