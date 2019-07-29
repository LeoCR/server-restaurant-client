module.exports = function(app,path,isLoggedIn) {
    app.get(['/user','/user/profile','/user/history','/user/history/invoice/:order_code'],isLoggedIn,function(req,res){
        res.status(200).sendFile(path.resolve(__dirname+'/../../../../react-redux-users-restaurant/build/index.html'));
    });
    app.get(['/checkout','/checkout/payment','/payment-successfully'],isLoggedIn,function(req,res){
        res.status(200).sendFile(path.resolve(__dirname+'/../../../../react-redux-checkout-restaurant/build/index.html'));
    })
}