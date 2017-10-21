define([
  "dojo/topic"
], function(topic) {
  /*
   * Custom Javascript to be executed while the application is initializing goes here
   */

  console.log("Map Journal is initializing");

  // The application is ready
  topic.subscribe("tpl-ready", function(){
    /*
     * Custom Javascript to be executed when the application is ready goes here
     */

    console.log("Map Journal is ready");
  });

  // When a section is being loaded (don't wait for the Main Stage media to be loaded)
  topic.subscribe("story-load-section", function(index){
    console.log("The section", index, "is being loaded");
  });

  // After a map is loaded (when the map starts to render)
  topic.subscribe("story-loaded-map", function(result){
    if ( result.index !== null ){
      console.log("The map", result.id, "has been loaded from the section", result.index);

      if ( result.id === "9545a91d0f284c6fb32f816e19925b35"){
        // We are in 'Vision general'
        var serviceUrl = "http://maps2.dcgis.dc.gov/dcgis/rest/services/SampleWorldCities/MapServer/0",
        xField = "POP_CLASS",
        toolTipTitle = "{POP_CLASS}";
        // Creamos el gráfico con las propiedades:
        var chart = new Cedar({
          //Tipo de gráfico
          "type": "bar",
          //Dataset
          "dataset": {
            "url":serviceUrl,
            //En esta query lo que hacemos es un conteo de las ciudades que hay en cada POP_CLASS
            "query": {
              "groupByFieldsForStatistics": xField,
              "outStatistics": [{
                "statisticType": "count",
                "onStatisticField": "OBJECTID",
                "outStatisticFieldName": "count_SUM"
              }]
            },
            //En mappings definimos que representamos: En X cada POP_CLASS y en Y el conteo de las ciudades en cada POP_CLASS
            "mappings":{
              "x": {"field":xField,"label":"Rangos de población"},
              "y": {"field":"count_SUM","label":"Número de ciudades"},
              "sort": "count_SUM DESC"
            }
          },
          //En tooltip definimos la ventana emergente al pasar el ratón por encima
          "tooltip": {
            "id": "tooltip-url",
            "title": toolTipTitle,
            "content": "{count_SUM} Ciudades"
          }
        });
        //Mostramos el gráfico
        chart.show({
          elementId: "#chart",
          autolabels: true
        });
      }
    }else
    console.log("The map", result.id, "has been loaded from a Main Stage Action");


  });

  // When a main stage action that loads a new media or reconfigures the current media is performed
  // Note that this event is not fired for the "Locate an address or a place action"
  topic.subscribe("story-perform-action-media", function(media){
    console.log("A Main Stage action is performed:", media);
  });
});
