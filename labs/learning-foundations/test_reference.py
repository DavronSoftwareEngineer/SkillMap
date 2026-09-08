import unittest
from reference import (raster_summary, validate_point, overlapping_groups,
                       cash_position, authorized_report, supported_summary)


class LearningFixtures(unittest.TestCase):
    def test_nodata_does_not_bias_mean(self):
        result = raster_summary([.2, .4, -9999, .6])
        self.assertAlmostEqual(result['mean'], .4)
        self.assertEqual(result['coverage'], .75)

    def test_empty_and_invalid_are_not_green_zero(self):
        for values in ([], [-9999], [None, float('nan'), float('inf'), True]):
            self.assertIsNone(raster_summary(values)['mean'])
        self.assertEqual(raster_summary([0])['mean'], 0)

    def test_range_alone_cannot_detect_swapped_point(self):
        area = (55, 37, 74, 46)
        self.assertEqual(validate_point([69.24, 41.31], area), (69.24, 41.31))
        with self.assertRaisesRegex(ValueError, 'Outside'):
            validate_point([41.31, 69.24], area)

    def test_rejects_coercion_and_nonfinite_coordinates(self):
        for point in (["69", 41], [True, 41], [float('nan'), 41], [190, 41]):
            with self.assertRaises(ValueError):
                validate_point(point, (55, 37, 74, 46))

    def test_spatial_group_leak(self):
        self.assertEqual(overlapping_groups(['field-a','field-b'], ['field-b']), {'field-b'})
        self.assertEqual(overlapping_groups(['field-a'], ['field-c']), set())

    def test_profit_is_not_cash(self):
        self.assertEqual(cash_position(10, 8, 5, 3, 3), {
            'profit': 5, 'cash_movement': 2, 'closing_cash': 12, 'receivable': 3})

    def test_cross_tenant_and_disabled_access(self):
        user = {'active': True, 'tenant':'a', 'role':'reader'}
        self.assertTrue(authorized_report(user, {'tenant':'a'}))
        self.assertFalse(authorized_report(user, {'tenant':'b'}))
        self.assertFalse(authorized_report({**user, 'active':False}, {'tenant':'a'}))

    def test_valid_shape_does_not_mean_grounded_facts(self):
        facts = {'status':'blocked', 'blocker':'CRS unknown', 'owner':'Ali'}
        valid = {**facts, 'deadline':None}
        self.assertTrue(supported_summary(valid, facts))
        self.assertFalse(supported_summary({**valid, 'deadline':'tomorrow'}, facts))
        self.assertFalse(supported_summary(facts, facts))


if __name__ == '__main__':
    unittest.main()
