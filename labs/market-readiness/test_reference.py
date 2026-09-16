import unittest

from reference import dense_bytes, masked_mean, merge_pages, scope_allows, snapshot_id


def feature(number, name="mock"):
    return {"attributes": {"OBJECTID": number, "name": name}, "geometry": None}


def page(ids, more=False):
    return {"features": [feature(i) for i in ids], "exceededTransferLimit": more}


class ImportContractTests(unittest.TestCase):
    def test_equal_duplicate_is_deduplicated(self):
        result = merge_pages([page([1, 2], True), page([2, 3])])
        self.assertEqual([f["attributes"]["OBJECTID"] for f in result], [1, 2, 3])

    def test_conflicting_duplicate_is_rejected(self):
        conflicting = {"features": [feature(1, "changed")], "exceededTransferLimit": False}
        with self.assertRaisesRegex(ValueError, "Conflicting"):
            merge_pages([page([1], True), conflicting])

    def test_incomplete_export_is_rejected(self):
        for pages in ([], [page([1], True)]):
            with self.subTest(pages=pages), self.assertRaisesRegex(ValueError, "Incomplete"):
                merge_pages(pages)

    def test_repeated_or_empty_continuation_is_rejected(self):
        for pages in ([page([1], True), page([1])], [page([], True)]):
            with self.subTest(pages=pages), self.assertRaisesRegex(ValueError, "progress"):
                merge_pages(pages)

    def test_http_200_error_body_is_not_success(self):
        with self.assertRaisesRegex(ValueError, "error"):
            merge_pages([{"error": {"code": 499, "message": "mock token required"}}])

    def test_explicit_empty_terminal_export_is_valid(self):
        self.assertEqual(merge_pages([page([])]), [])

    def test_bad_contracts_are_rejected(self):
        for pages in ([{"features": []}], [page([True])], [page([1]), page([2])]):
            with self.subTest(pages=pages), self.assertRaises(ValueError):
                merge_pages(pages)


class RasterPlanningTests(unittest.TestCase):
    def test_memory_arithmetic(self):
        self.assertEqual(dense_bytes((365, 4096, 4096), 4), 24494735360)
        self.assertEqual(dense_bytes((365, 4096, 4096), 4) / 1024**3, 22.8125)
        self.assertEqual(dense_bytes((8, 512, 512), 4) / 1024**2, 8)

    def test_invalid_dimensions(self):
        for shape, size in (((), 4), ((-1, 2), 4), ((True, 2), 4), ((2, 2), 0)):
            with self.subTest(shape=shape), self.assertRaises(ValueError):
                dense_bytes(shape, size)

    def test_nodata_is_not_zero(self):
        self.assertEqual(masked_mean([10, None, 20, float("nan")]), 15)
        self.assertIsNone(masked_mean([None, None]))
        self.assertIsNone(masked_mean([]))
        self.assertEqual(masked_mean([0, 0]), 0)

    def test_invalid_observation(self):
        for value in (True, "10", float("inf")):
            with self.subTest(value=value), self.assertRaises(ValueError):
                masked_mean([value])


class SnapshotTests(unittest.TestCase):
    def test_retry_and_key_order_are_stable(self):
        a = snapshot_id("r7", "a12", 1, {"region": "mock", "year": 2026})
        self.assertEqual(a, snapshot_id("r7", "a12", 1, {"year": 2026, "region": "mock"}))

    def test_changes_produce_new_identity(self):
        baseline = snapshot_id("r7", "a12", 1, {"year": 2026})
        for args in (("r8", "a12", 1, {"year": 2026}), ("r7", "a13", 1, {"year": 2026}),
                     ("r7", "a12", 2, {"year": 2026}), ("r7", "a12", 1, {"year": 2025})):
            with self.subTest(args=args):
                self.assertNotEqual(baseline, snapshot_id(*args))

    def test_missing_revision_is_rejected(self):
        with self.assertRaises(ValueError):
            snapshot_id("", "a12", 1, {})


class ScopeModelTests(unittest.TestCase):
    def test_exact_tenant_boundary(self):
        self.assertTrue(scope_allows("tenant-a", "tenants/tenant-a/cog/mock.tif"))
        self.assertFalse(scope_allows("tenant-a", "tenants/tenant-ab/cog/mock.tif"))
        self.assertFalse(scope_allows("tenant-a", "tenants/tenant-b/cog/mock.tif"))

    def test_invalid_or_noncanonical_paths_denied(self):
        for tenant, key in (("", "tenants//x"), ("../a", "tenants/../a/x"),
                            ("tenant-a", "tenants/tenant-a/../tenant-b/x"),
                            ("tenant-a", "tenants/tenant-a/%2e%2e/x"),
                            ("tenant-a", "tenants/tenant-a//x")):
            with self.subTest(tenant=tenant, key=key):
                self.assertFalse(scope_allows(tenant, key))


if __name__ == "__main__":
    unittest.main()
