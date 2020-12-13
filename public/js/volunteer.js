function deleteUserById(userId) {
    axios.delete('/users/'+userId)
        .then(res => {
            if(res.status === 200){
                console.log('data', DATA);
                let index = DATA.findIndex(x => x.id = userId);
                DATA.splice(index,1);
                $('#'+userId).remove();
            }
        })
        .catch(err => {
            console.log(err);
        });
}