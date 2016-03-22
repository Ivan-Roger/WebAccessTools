(function($){
  $.fn.calculatricePlugIn=function(){
    function init(){
      $(this)
      .append($("<div id="calc"></div>")
        .prepend($(<div id="ligne_affichage">)
          .preprend($(<input type="text" name="zone_affichage" id="zone_affichage" ondblclick="organize()" />)))
        .preprend($(<div class="ligne_boutons">)
          .preprend($(<input type="button" class="bouton_classique" value="MC" onClick="raz_memory()"/>)
          .after($(<input id='MR' type="button"  class="bouton_classique" value="MR" onClick="affiche_memory()"/>)
          .after($(<input type="button"  class="bouton_classique" value="MS" onClick="range_memory()"/>)
          .after($(<input type="button"  class="bouton_classique" value="+-" onClick="plusmoins()"/>)
          .after($(<input type="button" id="libre1" class="bouton_simple bouton_libre" value=" "/>)))
        )))));

    }
  }



})(jQuery);
