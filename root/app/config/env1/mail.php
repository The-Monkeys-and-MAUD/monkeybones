<?php
return array(
	/*
	 |--------------------------------------------------------------------------
	 | Global "From" Address
	 |--------------------------------------------------------------------------
	 |
	 | Name and address that is used globally for all e-mails that are sent by 
	 | the application.
	 |
	 */
	'from' => array('address' => 'noreply@' . Request::getHttpHost(), 'name' => null),
);