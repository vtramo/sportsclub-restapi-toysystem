@org.hibernate.annotations.GenericGenerator(
    name = "ID_GENERATOR",
    strategy = "enhanced-sequence",
    parameters = {
        @org.hibernate.annotations.Parameter(
                name = "sequence_name",
                value = "WEPLAY_SEQUENCE"
        ),
        @org.hibernate.annotations.Parameter(
                name = "initial_value",
                value = "1000"
        )
    }
)

@NamedQueries({
    /* Sports Facility Entity Queries */
    @NamedQuery(
        name = "SportsFacilityEntity.findAllByTotalNumberSportsFieldsBetween",
        query = "SELECT sf FROM SportsFacilityEntity sf WHERE sf.sportsFields.size > :min AND sf.sportsFields.size < :max"
    ),
    @NamedQuery(
        name = "SportsFacilityEntity.findAllByOwnerIdAndTotalNumberSportsFieldsBetween",
        query = "SELECT sf FROM SportsFacilityEntity sf WHERE sf.owner.id = :ownerId " +
                "AND sf.sportsFields.size > :min AND sf.sportsFields.size < :max"
    ),

    /* Reservation Entity Queries */
    @NamedQuery(
        name = "ReservationEntity.findAll",
        query = "select r from ReservationEntity r " +
                "where " +
                "(:state            is null or :state               = r.reservationStatus)               and " +
                "(:sport            is null or :sport               = r.sportsField.sport)               and " +
                "(cast(:createdAt as date)        is null or :createdAt           = r.createdAt)                       and " +
                "(cast(:startDate as date)        is null or :startDate           <= r.dateTimeRange.startDateTime)    and " +
                "(cast(:endDate as date)          is null or :endDate             >= r.dateTimeRange.endDateTime)      and " +
                "(:price            is null or :price               = r.price)                           and " +
                "(:sportsFieldId    is null or :sportsFieldId       = r.sportsField.id)                  and " +
                "(:sportsFacilityId is null or :sportsFacilityId    = r.sportsField.sportsFacility.id)"
    ),
    @NamedQuery(
        name = "ReservationEntity.generateSportsReservationsReportForSportsFacility",
        query = "select r.sportsField.sport as sport, " +
                "coalesce(count(r.id), 0) as totalReservations, " +
                "coalesce(sum(case when (r.reservationStatus = 'ACCEPTED') then 1 else 0 end), 0)       as acceptedReservations, " +
                "coalesce(sum(case when (r.reservationStatus = 'REJECTED') then 1 else 0 end), 0)       as rejectedReservations, " +
                "coalesce(sum(case when (r.reservationStatus = 'PENDING')  then 1 else 0 end), 0)       as pendingReservations,  " +
                "coalesce(sum(case when (r.reservationStatus = 'ACCEPTED') then r.price else 0 end), 0) as totalRevenue          " +
                "from ReservationEntity r where r.sportsField.sportsFacility.id = :sportsFacilityId      and " +
                "(cast(:startDate as date)        is null or :startDate           <= r.dateTimeRange.startDateTime)    and " +
                "(cast(:endDate as date)          is null or :endDate             >= r.dateTimeRange.endDateTime)      " +
                "group by sport"
    ),
    @NamedQuery(
        name = "ReservationEntity.generateSportsFieldReservationsReportForSportsField",
        query = "select r.sportsField.sport as sport, " +
                "coalesce(count(r.id), 0) as totalReservations, " +
                "coalesce(sum(case when (r.reservationStatus = 'ACCEPTED') then 1 else 0 end), 0)       as acceptedReservations, " +
                "coalesce(sum(case when (r.reservationStatus = 'REJECTED') then 1 else 0 end), 0)       as rejectedReservations, " +
                "coalesce(sum(case when (r.reservationStatus = 'PENDING')  then 1 else 0 end), 0)       as pendingReservations,  " +
                "coalesce(sum(case when (r.reservationStatus = 'ACCEPTED') then r.price else 0 end), 0) as totalRevenue          " +
                "from ReservationEntity r where r.sportsField.id = :sportsFieldId                        and " +
                "(cast(:startDate as date)         is null or :startDate           <= r.dateTimeRange.startDateTime)    and " +
                "(cast(:endDate as date)          is null or :endDate             >= r.dateTimeRange.endDateTime)      " +
                "group by sport"
    ),
    @NamedQuery(
        name = "ReservationEntity.generateSportsReservationsReportForAllSportsFacility",
        query = "select r.sportsField.sportsFacility.id as sportsFacilityId, " +
                "r.sportsField.sport as sport, " +
                "coalesce(count(r.id), 0) as totalReservations, " +
                "coalesce(sum(case when (r.reservationStatus = 'ACCEPTED') then 1 else 0 end), 0)       as acceptedReservations, " +
                "coalesce(sum(case when (r.reservationStatus = 'REJECTED') then 1 else 0 end), 0)       as rejectedReservations, " +
                "coalesce(sum(case when (r.reservationStatus = 'PENDING')  then 1 else 0 end), 0)       as pendingReservations,  " +
                "coalesce(sum(case when (r.reservationStatus = 'ACCEPTED') then r.price else 0 end), 0) as totalRevenue          " +
                "from ReservationEntity r where " +
                "(cast(:startDate as date)        is null or :startDate           <= r.dateTimeRange.startDateTime)    and " +
                "(cast(:endDate as date)          is null or :endDate             >= r.dateTimeRange.endDateTime)      " +
                "group by sportsFacilityId, sport"
    ),

    /* Reservations Summary Entity */
    @NamedQuery(
        name = "ReservationsSummaryEntity.getReservationsSummaries",
        query = "select r from ReservationsSummaryEntity r " +
                "where (:month is null or :month = r.month) and" +
                "      (:year is null or :year = r.year)    and" +
                "      (:sportsFacilityId is null or :sportsFacilityId = r.sportsFacility.id)"
    )
})

package systems.fervento.sportsclub.repository;

import org.hibernate.annotations.NamedQueries;
import org.hibernate.annotations.NamedQuery;