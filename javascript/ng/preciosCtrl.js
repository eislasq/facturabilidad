angular.module('FAC')
        .controller('preciosCtrl', ['$scope'
                    , function ($scope) {

                        $scope.paquete = {cantidad: 100};


                        $scope.timbresStep = 5;
                        $scope.calcularTimbresStep = function () {
//                            var timbres = $scope.paquete.cantidad || $scope.chartPriceParams.compra_minima;
//                            var step = Math.ceil(timbres / 3);
//                            $scope.timbresStep = Math.ceil(step / 10) * 10;
                            $scope.timbresStep = 10;
                            return $scope.timbresStep;
                        };

                        /*********** chart *************/
                        /*******************************/
                        $scope.chartLabels = [];
                        $scope.chartSeries = ['Precio'];
                        $scope.chartData = [[], []];

                        $scope.chartColors = ['#45b7cd', '#ff6384', '#ff8e72'];

                        $scope.datasetOverride = [

                            {
                                borderWidth: 3,
                                hoverBackgroundColor: "rgba(255,99,132,0.4)",
                                hoverBorderColor: "rgba(255,99,132,1)",
                                pointHoverRadius: 10
                                , pointRadius: 10
                                , pointHoverBackgroundColor: "#45b7cd"
                                , pointHoverBorderColor: "rgba(255,99,132,0.4)"
                                , pointHoverBorderWidth: 20
                                , type: 'line'
                            }
                            , {
                                type: 'bubble'
                            }
                        ];

                        $scope.chartPriceParams = {}




                        $scope.chartPriceParams.compra_minima = 10;
                        $scope.chartPriceParams.contexto = 10;
                        $scope.chartPriceParams.precision = Math.pow(10, 2);

                        var bubleNull = {x: null, y: null, r: null};

                        $scope.updateChart = function () {
                            var incremento = $scope.calcularTimbresStep();
                            var timbres = ($scope.paquete.cantidad - incremento) || $scope.chartPriceParams.compra_minima;

                            for (var s = 0; s < $scope.chartPriceParams.contexto; s++) {
                                $scope.chartLabels[s] = timbres.toLocaleString();
                                var precio = $scope.precioPorVolumen(timbres);
                                $scope.chartData[0][s] = precio;
                                if ($scope.paquete.cantidad === timbres) {
                                    $scope.chartData[1][s] = {x: timbres, y: precio, r: 20};
                                } else {
                                    $scope.chartData[1][s] = bubleNull;

                                }

                                timbres += incremento;
                            }
                            $scope.calcularTotal();

                        };

                        $scope.precioPorVolumen = function (volumenVenta) {
                            volumenVenta = parseInt(volumenVenta) || 0;
                            var base = 5;
                            var minimo = 2;
                            var precioUnitario = Math.max(minimo, base / Math.log(volumenVenta) * base - 1.5);

                            precioUnitario = Math.round(precioUnitario * $scope.chartPriceParams.precision) / $scope.chartPriceParams.precision;
//                            var precio = precioUnitario * 1.16;//se agrega el IVA
//                            precio = Math.round(precio * $scope.chartPriceParams.precision) / $scope.chartPriceParams.precision;
                            return precioUnitario;
                        };


                        $scope.chartOnClick = function (points, evt) {
                            if (points.length < 1) {
                                return false;
                            }
                            var index = points[0]._index;
                            var timbresClick = parseInt($scope.chartLabels[index].replace(new RegExp(',', 'g'), ''));

//                            console.log('timbresClick', timbresClick);

                            timbresClick = Math.max($scope.chartPriceParams.compra_minima, timbresClick);
                            if ($scope.paquete.cantidad === timbresClick) {
                                return false;
                            }

                            $scope.$apply(function (scope) {
                                scope.paquete.cantidad = timbresClick;
                                $scope.updateChart();
                            });
                        };
                        $scope.updateTimbres = function (diferencia) {
                            var timbres = ($scope.paquete.cantidad || 0) + diferencia;
                            timbres = Math.max($scope.chartPriceParams.compra_minima, timbres);
                            $scope.paquete.cantidad = timbres;
                            $scope.updateChart();
                        };

                        $scope.chartOptions = {
                            scales: {
                                xAxes: [{
                                        display: true,
                                        scaleLabel: {
                                            display: true,
                                            labelString: 'Timbres'
                                        }
                                    }]
                                , yAxes: [{
                                        display: true
                                        , scaleLabel: {
                                            display: true,
                                            labelString: 'Precio por timbre $(MXN)'
                                        }
                                        , ticks: {
                                            // Include a dollar sign in the ticks
                                            callback: function (value, index, values) {
                                                value = Math.round(value * $scope.chartPriceParams.precision) / $scope.chartPriceParams.precision;
                                                return '$' + value.toLocaleString();
                                            }
                                        }
                                    }]
                            }
                            , animation: {
                                duration: 0
                            }
                            , elements: {
                                line: {
                                    tension: 0.3, // bezier curves (0 disables)
                                }
                            }
                            , tooltips: {
                                callbacks: {
                                    title: function (tooltipItems, data) {
                                        return tooltipItems[0].xLabel + " Timbres";
                                    }
                                    , label: function (tooltipItem, data) {

                                        return "Precio por timbre: $" + tooltipItem.yLabel + ' MXN';
                                    }
                                }
                            }
                        };
                        /************* end chart********/
                        /*******************************/

                        $scope.total = 0;

                        $scope.calcularTotal = function () {
                            var precio = $scope.paquete.cantidad * $scope.precioPorVolumen($scope.paquete.cantidad);
                            $scope.total = precio || 0;
                            return $scope.total;
                        };
                        
                        $scope.updateChart();


                    }]);