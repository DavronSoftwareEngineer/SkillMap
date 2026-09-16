# Geospatial market-readiness: kichik kontrakt laboratoriyasi

Barcha obyektlar sun’iy. Internet, API key, cloud hisob, ArcGIS litsenziyasi yoki
korxona ma’lumoti kerak emas. Python 3.10+ standart kutubxonasi yetadi.

Repo ildizidan:

```sh
python -m unittest discover -s labs/market-readiness -v
```

## Nimani sinaysiz?

| Kurs moduli | Reference | Kutilgan natija |
| --- | --- | --- |
| `cn1` enterprise interoperability | `merge_pages` | [1,2] + [2,3] → [1,2,3]; conflict/error/incomplete → xato |
| `py2` raster cube | `dense_bytes`, `masked_mean` | 22.8125 GiB; chunk 8 MiB; nodata nol emas |
| `z19` data engineering | `snapshot_id` | Bir xil revision/code/schema/params → ayni ID |
| `z26` cloud ownership | `scope_allows` | tenant-a tenant-ab faylini o‘qiy olmaydi |
| `z32` portfolio | Quyidagi evidence fayli | Da’vo va tekshirilgan dalil ajratilgan |

1. Testni o‘qing, natijani oldindan taxmin qiling, keyin ishga tushiring.
2. Fixture yoki parametrni o‘zgartiring. Natija nega o‘zgarganini yozing.
3. Kamida bitta yangi salbiy test qo‘shing va mustaqil tushuntiring.
4. Natijani `requirement-matrix.md` ichida talab → test → cheklov → keyingi
   integratsiya ko‘rinishida qayd eting. Haqiqiy run sanasi va muhitini yozing.

## Muhim chegara

Bu **production SDK emas**. `merge_pages` faqat aniq mock kontraktni tekshiradi;
real servis metadata, pagination, CRS, retry yoki izchil snapshotni tekshirmaydi.
`snapshot_id` GeoParquet yozmaydi. `scope_allows` authentication/IAM evaluator
emas, haqiqiy xavfsizlik uchun qo‘llanmaydi. Memory arifmetikasi performance
benchmark emas. `masked_mean` raster faylini o‘qimaydi.

Keyingi mustaqil bosqich: ruxsatli manba bilan adapter testi, GeoParquetni
qayta o‘qib metadata/count/bbox solishtirish, kichik xarray/Dask fixture,
real IAM role bilan allow/deny va restore sinovi. Har birini alohida dalillang;
bu laboratoriya yashil bo‘lgani ularning bajarilganini anglatmaydi.
