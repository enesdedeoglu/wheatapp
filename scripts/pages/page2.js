const extend = require("js-base/core/extend");
const HeaderBarItem = require("sf-core/ui/headerbaritem");
const Page = require("sf-core/ui/page");
const ListViewItem = require("sf-core/ui/listviewitem");
const FlexLayout = require('sf-core/ui/flexlayout');
const Label = require("sf-core/ui/label");
const HTTP = require("sf-core/net/http");
const ImageView = require("sf-core/ui/imageview");
const Color = require("sf-core/ui/color");
const ListView = require("sf-core/ui/listview");
const Font = require('sf-core/ui/font');
const PageWithContx = require('@smartface/contx/lib/smartface/PageWithContx');
const Application = require('sf-core/application');
const PageTitleLayout = require("components/PageTitleLayout");
const componentContextPatch = require("@smartface/contx/lib/smartface/componentContextPatch");
const System = require("sf-core/device/system");
const Image = require("sf-core/ui/image");


const Page2 = extend(PageWithContx)(
    function(_super, routeData, router) {
        _super(this, {
            onShow: function(params) {
                Application.statusBar.visible = false;
                this.headerBar.visible = false; //For Android
            }
        });

        // Overrides super.onShow method
        this.onShow = onShow.bind(this, this.onShow.bind(this));
        this.onLoad = onLoad.bind(this, this.onLoad.bind(this));

        this.layout.flexDirection = FlexLayout.FlexDirection.ROW;
        this.layout.justifyContent = FlexLayout.JustifyContent.CENTER;
        this.layout.alignItems = FlexLayout.AlignItems.CENTER;

        
        lblCity = new Label({             // A label to show which city is shown in the ListView
            text: routeData.message,
            marginTop: 5,
            font: Font.create("TimesNewRomanPS-BoldMT", 30),
            marginLeft: 29,
            textColor: Color.create("#82E0AA")
        });
        this.layout.addChild(lblCity);

        myListView = new ListView({      // Holds Wheather forecast data
            flexGrow: 1,
            alignSelf: FlexLayout.AlignSelf.STRETCH,
            rowHeight: 90,
            backgroundColor: Color.WHITE
        });

        this.layout.addChild(myListView);


        listRandomUsers();


    });

var lblCity = null;
var myListView = null;
//Holds the random user data in json format 
var myJSONData;

function setLabel(labelText) {
    lblCity.text = labelText + " Hava Durumu";
}
//Holds the 5 day / 3 hour  wheather forecast data in json format 
function getJSONData(messa) {

    //Http provides handling REST request
    var sessionManager = new HTTP();
    //Handle the request as JSON data
    var request = sessionManager.requestJSON({
        url: 'https://api.openweathermap.org/data/2.5/forecast?q=' + messa + ',tr&units=metric&appid=b57d067f49fc98f1594bf2c61c5787fa&lang=tr',
        onLoad: function(e) {
            //Returns JSON object 
            myJSONData = e.JSON.list;
            //Sets itemCount of ListView
            myListView.itemCount = myJSONData.length;
            //Refresh ListView data
            myListView.refreshData();
        },
        onError: function(e) {
            alert(e.message);
        }
    });

}



function listRandomUsers() {

    myListView.onRowCreate = function() {


        var userFlexLayout = new FlexLayout({
            id: 105,
            top: 0,
            left: 0,
            bottom: 0,
            positionType: FlexLayout.PositionType.RELATIVE,
            flexDirection: FlexLayout.FlexDirection.ROW,
            backgroundColor: Color.create("#99d9f9")
        });

        var myListViewItem = new ListViewItem();

        var wheatDetailLabel = new Label({
            id: 102,
            height: 50,
            width: 240,
            alignSelf: FlexLayout.AlignSelf.AUTO
        });


        var wheatherImage = new ImageView({
            id: 104,
            width: 50,
            height: 50
        });

        userFlexLayout.addChild(wheatherImage);
        userFlexLayout.addChild(wheatDetailLabel);

        myListViewItem.addChild(userFlexLayout);

        return myListViewItem;
    };

    myListView.onRowBind = function(listViewItem, index) {
        //Receives flexLayout by its id
        var flexLayout = listViewItem.findChildById(105);
        var wDetail = flexLayout.findChildById(102);
        wDetail.font = Font.create(Font.DEFAULT, 15, Font.BOLD);
        wDetail.text = "Tarih: " + myJSONData[index].dt_txt.substring(8, 10) +
        myJSONData[index].dt_txt.substring(4, 8) + myJSONData[index].dt_txt.substring(0, 4) + 
        "  Saat: " + myJSONData[index].dt_txt.substring(11, 16) +
        " " + "Sıcaklık: " + myJSONData[index].main.temp+ "°С  " 
        + myJSONData[index].weather[0].description;
        var wheatImage = flexLayout.findChildById(104);
        //Pass each wheater picture and ImageView component
        parseImageUrl(myJSONData[index].weather[0].icon, wheatImage);

    };

    myListView.onPullRefresh = function() {
        myListView.itemCount = myJSONData.length;
        myListView.refreshData();
        myListView.stopRefresh();
    }


}

//Captures Image URL by HTTP request and  assign the captured image to userImage 
//component
function parseImageUrl(imageURL, wheaterImage) {

    var sessionManager = new HTTP();

    var request = sessionManager.requestImage({
        url: 'https://openweathermap.org/img/wn/' + imageURL + '@2x.png',
        onLoad: function(e) {
            wheaterImage.image = e.image;
        },
        onError: function(e) {
            alert(e.message);
        }

    });
}

function onShow(superOnShow) {
    const { routeData,headerBar } = this;
    superOnShow();
    headerBar.titleLayout.applyLayout();
    routeData && console.log(routeData.message);
    // if (!e) return;
    //  console.log(e.message);
    console.log(routeData.message);
    setLabel(routeData.message);
    getJSONData(routeData.message);
   
}

function onLoad(superOnLoad) {
    var headerBar;
    superOnLoad();
    this.headerBar.titleLayout = new PageTitleLayout();
  
    this.headerBar.title = "WheatApp";
    if (System.OS === "Android") {
        headerBar = this.headerBar;
        headerBar.setLeftItem(new HeaderBarItem({
            onPress: () => {
                this.router.goBack();
            },
            image: Image.createFromFile("images://arrow_back.png")
        }));
    }
    else {
        headerBar = this.parentController.headerBar;
    }
    headerBar.itemColor = Color.WHITE;
}

module.exports = Page2;
