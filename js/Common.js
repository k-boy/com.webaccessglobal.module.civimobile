/**
 * Function to parse and get the values from url
 */
function getURLParameter(name) {
  return decodeURI(
      (RegExp(name + '=' + '(.+?)(&|$)').exec(location.search)||[,null])[1]
      );
}

/**
 * function to build profile
 */
function buildProfile( profileId, profileContainerId, contactId ) {
  var params = {};
  var jsonProfile = {};
  var fieldIds = {};
  if (contactId ) {
    var dataUrl = '/civicrm/profile/edit?reset=1&json=1&gid=' + profileId +'&id=' + contactId;
  }
  else {
    var dataUrl = '/civicrm/profile/create?reset=1&json=1&gid=' + profileId;
  }
  $.getJSON( dataUrl,
      {
        format: "json"
      },
      function(data) {
        jsonProfile = data
        //console.log(jsonProfile);
        $().crmAPI ('UFField','get',{'version' :'3', 'uf_group_id' : profileId}
      ,{ success:function (data){
        $.each(data.values, function(index, value) {
          //Logic to handle the different field names generated by the API and JSON object, specifically with phone, email and address fields.
          if (value.location_type_id){
            if (value.field_name.indexOf("phone") != -1){
              var field = jsonProfile[value.field_name+"-"+value.location_type_id+"-"+value.phone_type_id];
            }
            else{
              var field = jsonProfile[value.field_name+"-"+value.location_type_id];
            }
          }
          else if (value.field_name.indexOf("email") != -1){
            var field = jsonProfile[value.field_name+"-Primary"];
          }
          else if (value.field_name.indexOf("phone") != -1){
            var field = jsonProfile[value.field_name+"-Primary-"+value.phone_type_id];
          }
          else{
            var field = jsonProfile[value.field_name];
          }
        field = field.html;
        //build fields
        $('#' + profileContainerId ).append('<div data-role="fieldcontain" class="ui-field-contain ui-body ui-br">'+field+'</div>');
        //console.log(value.label);
        var id = $(field).attr('id');
        var tagName = $(field).get(0).tagName;
        //var tagName = tagName;
        if (tagName == 'INPUT'){
          $('#'+id).textinput();
          $('#'+id).attr( 'placeholder', value.label )
        }
        if (tagName == 'SELECT'){
          $('#'+id).selectmenu();
          $('#'+id).parent().parent().prepend('<label for="'+id+'">'+value.label+':</label>');
        }
        params[value.field_name] = "";
        fieldIds[id] = "";
        });
      }
      });
   });
}

