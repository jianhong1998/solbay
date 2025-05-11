import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { isURL } from 'class-validator';
import { isBefore } from 'date-fns';
import { BaseDBUtil } from 'src/common/base-classes/base-db-util';
import { DateTimeFormat } from 'src/common/constants/format-string';
import { DateTimeHelper } from 'src/common/helpers/datetime.helper';
import { EntityManager, Repository } from 'typeorm';

import { LogisticTrackingInfoModel } from '../models/logistic-tracking-info.model';
import { ILogisticTrackingInfoCreationData } from '../types/logistic/logistic-tracking-info-creation-data.type';

@Injectable()
export class LogisticTrackingInfoDBUtil extends BaseDBUtil<
  LogisticTrackingInfoModel,
  ILogisticTrackingInfoCreationData
> {
  constructor(
    @InjectRepository(LogisticTrackingInfoModel)
    repo: Repository<LogisticTrackingInfoModel>,
  ) {
    super(LogisticTrackingInfoModel, repo);
  }

  public async create(params: {
    creationData: ILogisticTrackingInfoCreationData;
    entityManager?: EntityManager;
  }): Promise<LogisticTrackingInfoModel> {
    const {
      creationData: {
        estimatedDeliverDate,
        logisticProvider,
        trackingCode,
        trackingUrl,
      },
      entityManager,
    } = params;
    const repo =
      entityManager?.getRepository(LogisticTrackingInfoModel) ?? this.repo;

    if (!logisticProvider.trim().length)
      throw new Error('Logistic provider cannot be empty.');

    if (!trackingCode.trim().length)
      throw new Error('Tracking code cannot be empty');

    if (!isBefore(new Date(), estimatedDeliverDate)) {
      const formattedToday = DateTimeHelper.format(
        new Date(),
        DateTimeFormat.DATE_TIME_WIHTOUT_SECONDS_WITH_TIMEZONE,
      );
      const formattedEstimatedDeliveryDate = DateTimeHelper.format(
        estimatedDeliverDate,
        DateTimeFormat.DATE_TIME_WIHTOUT_SECONDS_WITH_TIMEZONE,
      );

      throw new Error(
        `Estimated delivery date (${formattedEstimatedDeliveryDate}) must be after now ${formattedToday}`,
      );
    }

    if (trackingUrl && !isURL(trackingUrl)) {
      throw new Error(`Invalid tracking URL (${trackingUrl})`);
    }

    const logisticTrackingInfo = repo.create({
      logisticProvider,
      trackingUrl,
      trackingCode,
      estimatedDeliverDate,
    });

    return await repo.save(logisticTrackingInfo);
  }
}
