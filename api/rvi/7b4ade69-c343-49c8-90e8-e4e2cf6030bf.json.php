<?php
	$seed = 14373;
	$degree = 20.0 + 3.0 * sin($seed+time()/10.0);
	$precision = 2;
	$self_uri = $_SERVER['SCRIPT_URI'];
	
	header("Content-type: application/json");
?>{
	"fw_rvi": {
		"sensors": {
			"temperature": {
				"value": <?php echo number_format($degree, $precision); ?>,
				"unit": "degree Celsius"
			}
		},
		"source": {
			"self": "<?php echo $self_uri; ?>"
		}
	}
}