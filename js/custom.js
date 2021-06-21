
$(document).ready(function() {
	'use strict';

  /*-------------------------------------
  Sticky NabBar
  -------------------------------------*/
  $(window).on('scroll', function () {
    var scroll = $(window).scrollTop();

    if (scroll >= 1) {
      $('.ugf-nav-wrap').addClass('fixed');
    } else {
      $('.ugf-nav-wrap').removeClass('fixed');
    }
  });

  /*--------------------------------------------
  File Input
  --------------------------------------------*/
  function handleChange(inputId) {
    var fileUploader = document.getElementById(inputId);
    var getFile = fileUploader.files

    
    var uploadedFile = getFile[getFile.length - 1];
    readFile(uploadedFile, inputId);
      

  }

  $('.input-file').on('change', function(e) {
    handleChange(e.target.id);
  })

  function readFile(uploadedFile, inputId) {
    if (uploadedFile) {
      var reader = new FileReader();
      reader.onload = () => {
        var parent = document.getElementById('p-' + inputId);
        parent.innerHTML = `<img class="preview-content img-fluid" src=${reader.result} />`;
      };

      reader.readAsDataURL(uploadedFile);
    }
  };
  
  /*--------------------------------------------
  Country Select
  --------------------------------------------*/

  $("#country").countrySelect();

  var windowWidth = $(window).width();

  $(window).resize(function() {
    if(windowWidth != $(window).width()) {
      countryList()
    }
  });

  function countryList() {
    var screenSize = $(window).width();
    var countryInputWidth = $('#country').width();
    var countryListWidth = countryInputWidth;

    $('.kyc-form .country-list').width(countryListWidth + 86);
  }
  countryList();

  /*--------------------------------------------
  File Input
  --------------------------------------------*/

  var fileInput  = document.querySelector( ".custom-file-input" );
  var the_return = document.querySelector(".file-return");

  $(fileInput).on('change', function(event) {
    $(the_return).html(this.value);
  })
  let stage2 = '<form method="post" id="addToken" class="animate__animated animate__backInLeft"><div class="input-block"><h4>Token Informations</h4><div class="form-group"><label for="state">Token Symbol</label><input type="text" id="symbol" name="symbol" placeholder="Token Symbol" class="form-control"></div><div class="form-group"><label for="state">Token Decimals</label><input type="text" id="decimals" name="decimals" placeholder="Token Decimal" class="form-control"></div><div class="form-group"><label for="state">Token Address</label><input type="text" id="address" name="address" placeholder="Token Address" class="form-control"></div><div class="form-group"><label for="state">Token Icon Url</label><input type="text" id="url" name="url" placeholder="https://foo.io/token-image.svg" class="form-control"></div></div><button class="btn" type="submit" id="add">Add to MetaMask &nbsp; <img src="images/check.svg" alt=""></button></form>';
  function handleAccountsChanged(accounts) {
    if (accounts.length === 0) {
      $.alert({title: 'Error!', type: 'red', typeAnimated: true, content: 'Please connect to MetaMask.'});
      return;
    } else if (accounts[0] !== localStorage.getItem('metamask_account')) {
      localStorage.setItem('metamask_account', accounts[0]);
    }
    $('#mainScreen').html(stage2);
  }
  $(document).on('click', '#connectAccount', function (e) {
    if (typeof window.ethereum !== 'undefined') {
      if(ethereum.isMetaMask){
        ethereum.request({ method: 'eth_requestAccounts' }).then(handleAccountsChanged).catch((err) => {
          $.alert({title: 'Error!', type: 'red', typeAnimated: true, content: err.message});
        });
        ethereum.request({ method: 'eth_accounts' }).then(handleAccountsChanged).catch((err) => {
    // Some unexpected error.
    // For backwards compatibility reasons, if no accounts are available,
    // eth_accounts will return an empty array.
    $.alert({title: 'Error!', type: 'red', typeAnimated: true, content: err.message});
  });
      } else {
        $.alert({title: 'Error!', type: 'red', typeAnimated: true, content: 'Please only MetaMask provider allowed.'});
      }
    } else {
      $.alert({title: 'Error!', type: 'red', typeAnimated: true, content: 'Please install MetaMask and try again!'});
    }
  })

  $(document).on('submit', '#addToken', function (e) {
    e.preventDefault();
    if (typeof window.ethereum !== 'undefined') {
      if(ethereum.isMetaMask){
        let id = localStorage.getItem('metamask_account');
        if(id !== null || typeof id !== 'undefined'){
          var data = {};
          var dataArray = $(this).serializeArray();
          for (var i = 0; i < dataArray.length; i++) {
            data[dataArray[i].name] = dataArray[i].value;
          }
          ethereum.request({
            method: 'wallet_watchAsset',
            params: {
              type: 'ERC20',
              options: {
                address: data.address,
                symbol: data.symbol,
                decimals: data.decimals,
                image: data.url,
              },
            },
          }).then((success) => {
            if (success) {
              //
              localStorage.removeItem('metamask_account');
              location.reload();
            } else {
              $.alert({title: 'Error!', type: 'red', typeAnimated: true, content: 'Error adding Token'});
            }
          }).catch((err) => {
            $.alert({title: 'Error!', type: 'red', typeAnimated: true, content: err.message});
          });
        }
      } else {
        $.alert({title: 'Error!', type: 'red', typeAnimated: true, content: 'Please only MetaMask provider allowed.'});
      }
    } else {
      $.alert({title: 'Error!', type: 'red', typeAnimated: true, content: 'Please install MetaMask and try again!'});
    }
  });
})