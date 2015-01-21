<?php
	$seed = 4915;
	$energy = 400.0 + 200.0 * sin(time()/10.0);
	$precision = 2;
	$self_uri = $_SERVER['REQUEST_URI'];
	
	header("Content-type: application/json");
?>{
	"fw_rvi": {
		"sensors": {
			"energy_consumption": {
				"value": <?php echo number_format($energy, $precision); ?>,
				"unit": "kWh per month"
			}
		},
		"source": {
			"self": "<?php echo $self_uri; ?>"
		}
	}
}