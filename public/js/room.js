function deleteRoomById(roomId) {
    axios.delete('/rooms/'+roomId)
        .then(res => {
            if(res.status === 200){
                $('#'+roomId).remove();
            }
        })
        .catch(err => {
            console.log(err);
        });
}