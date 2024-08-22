L.OWM = L.TileLayer.extend({
	options: {
		appId: 'aeb38512d52006194d6b7c57a0362aee', /* pass your own AppId as parameter when creating the layer. Get your own AppId at https://www.openweathermap.org/appid */
		baseUrl: "https://{s}.tile.openweathermap.org/map/{layername}/{z}/{x}/{y}.png",
		maxZoom: 18,
		showLegend: true,
		legendImagePath: null,
		legendPosition: 'bottomleft',
		attribution: 'Weather from <a href="https://openweathermap.org/" alt="World Map and worldwide Weather Forecast online">OpenWeatherMap</a>'
	},

	initialize: function (options) {
		L.Util.setOptions(this, options);
		var tileurl = this.options.baseUrl.replace('{layername}', this._owmLayerName);
		tileurl = tileurl + '?appid=' + this.options.appId;

		this._map = null;
		this._legendControl = null;
		this._legendId = null;
		this._owmtileurl = tileurl;
		L.TileLayer.prototype.initialize.call(this, this._owmtileurl, options);
	},

	onAdd: function(map) {
		this._map = map;
		if (this.options.showLegend && this.options.legendImagePath != null) {
			this._legendControl = this._getLegendControl();
			this._legendId = this._legendControl.addLegend(this.options.legendImagePath);
		}
		L.TileLayer.prototype.onAdd.call(this, map);
	},

	onRemove: function(map) {
		if (this._legendControl != null) {
			this._legendControl.removeLegend(this._legendId);
			this._legendControl = null;
			this._legendId = null;
		}
		L.TileLayer.prototype.onRemove.call(this, map);
		this._map = null;
	},

	_getLegendControl: function() {
		if (typeof this._map._owm_legendcontrol == 'undefined' || !this._map._owm_legendcontrol) {
			this._map._owm_legendcontrol = new L.OWM.LegendControl({position: this.options.legendPosition});
			this._map.addControl(this._map._owm_legendcontrol);
		}
		return this._map._owm_legendcontrol;
	}
});

(function(){
    
	L.OWM.Temperature = L.OWM.extend({
		_owmLayerName: 'temp'
	});
	L.OWM.temperature = function (options) {
		var layer = new L.OWM.Temperature(options);
		if (layer.options.legendImagePath == null) {
			layer.options.legendImagePath = 'https://openweathermap.org/img/a/TT.png';
		}
		return layer;
	};
})