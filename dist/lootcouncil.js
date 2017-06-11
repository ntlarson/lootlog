let utils = {
  buildItemLink: function (options) {
    let itemLink = '<a href="http://www.wowhead.com/item=' + options.id + '"';

    if (options.bonuses.length > 0) {
        itemLink +=  ' rel="bonus=' + options.bonuses.join(':') + '"'
    }

    itemLink += ' class="q4">' + options.name + '</a>';

    return itemLink;
  }
}

$(document).ready(function () {
    let lootListTable = $('#lootTable').DataTable({
      columnDefs: [
        {width: '25%', targets: 0},
        {width: '25%', targets: 1},
        {width: '50%', targets: 2},
      ]
    });

    let lootListController = function () {
      $.ajax({
        method: 'GET',
        url: '/item/awards',
        success: function (data) {
          console.log(data);
          for (let i = 0; i < data.awards.length; i++) {
            let thisAward = data.awards[i];
            let itemLink = utils.buildItemLink({
              id: thisAward.itemId,
              bonuses: thisAward.itemBonuses,
              name: thisAward.itemName
            });

            lootListTable.row.add([moment(thisAward.dateAwarded*1000).format('MM.DD.YYYY'), thisAward.awardedTo, itemLink]).draw(false);
          }
        }
      })
    }

    lootListController();

    $(document).on('click', 'input[type="button"]', function (e) {
        e.preventDefault();

        let lootTable = $('table');
        let itemLink = '';
        let logToDb = {
            dateAwarded: moment().unix(),
            awardedTo: '',
            itemId: '',
            itemName: '',
            itemBonuses: []
        }
        let character = $('#charName').val();
        let id = $('#itemId').val();
        let modifier = $('.modifiers').val()
        let socket = $('#socket').is(':checked');

        if (!character || !id) {
            alert('Must provide a character name and all item information');
            return;
        }

        $.ajax({
          method:'GET',
          url: '/item/'+id,
          success: function (data) {
            console.log(data.Name);
            logToDb.awardedTo = character;
            logToDb.itemId = id;
            logToDb.itemName = data.Name;

            if (modifier) {
                logToDb.itemBonuses.push(modifier);
            }

            if (socket) {
                logToDb.itemBonuses.push('1808');
            }

            //add other modifier values to array here -- TODO figure out how to calculate bonus for ilvl upgrades

            itemLink = utils.buildItemLink({
              id: logToDb.itemId,
              bonuses: logToDb.itemBonuses,
              name: logToDb.itemName
            });

            lootListTable.row.add([moment(logToDb.dateAwarded*1000).format('MM.DD.YYYY'), logToDb.awardedTo, itemLink]).draw(false);
          }
        });
    });
});
