/*
Copyright (c) Uber Technologies, Inc.

This source code is licensed under the MIT license found in the
LICENSE file in the root directory of this source tree.
*/
import * as React from 'react';
import { Scenario as FixedMarkerStory } from './fixed-marker.scenario';
import { Scenario as FloatingMarkerStory } from './floating-marker.scenario';
import { Scenario as FloatingMarkerMapStory } from './floating-marker-map.scenario';
import { Scenario as FixedMarkerMapStory } from './fixed-marker-map.scenario';
import { Scenario as EatsPickupMarkerStory } from './eats-pickup-marker.scenario';

export const FixedMarker = () => <FixedMarkerStory />;
export const FloatingMarker = () => <FloatingMarkerStory />;
export const FloatingMarkerMap = () => <FloatingMarkerMapStory />;
export const FixedMarkerMap = () => <FixedMarkerMapStory />;
export const EatsPickupMarker = () => <EatsPickupMarkerStory />;
