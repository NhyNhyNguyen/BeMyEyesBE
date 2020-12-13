function deleteUserById(userId) {
    axios.delete('/users/'+userId)
        .then(res => {
            if(res.status === 200){
                $('#'+userId).remove();
            }
        })
        .catch(err => {
            console.log(err);
        });
}