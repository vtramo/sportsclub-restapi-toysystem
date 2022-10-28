package systems.fervento.sportsclub.repository;

/*import systems.fervento.polisportiva.entity.ItemEntity;

import java.util.Set;

@Repository
public interface ItemRepository extends JpaRepository<ItemEntity, Long> {

    @Query("select i from ItemEntity i inner join fetch i.images where i.id = :id")
    ItemEntity findItemWithImages(@Param("id") Long id);

    @Query(value = "SELECT FILENAME FROM IMAGE WHERE ITEM_ID = ?1", nativeQuery = true)
    Set<String> findImagesNative(Long id);
}*/
